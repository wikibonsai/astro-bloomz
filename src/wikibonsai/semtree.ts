import { getCollection } from 'astro:content';
import path from 'path';
import { SemTree } from 'semtree';


export async function buildBonsai() {
  // init vars
  const bonsai = new SemTree({
    // if set to 'false', make sure to extract urls of index docs below
    virtualTrunk: true,
  });
  const bonsaiText: any = {}; // { filename: content } hash
  const rootFilename: string = 'i.bonsai';
  // build 'bonsaiText' hash
  const allIndexDocs = await getCollection('index');
  allIndexDocs.forEach((doc: any) => {                  // remove preceding/trailing newlines/whitespace
    bonsaiText[path.basename(doc.id, '.md')] = doc.body.replace(/^\s+|\s+$/g, '');
  });
  let res;
  try {
    // build bonsai tree data struct
    res = bonsai.parse(bonsaiText, rootFilename);
    // append url for template rendering and init fam metadata
    const allEntryDocs = await getCollection('entries');
    for (const node of bonsai.tree) {
      const doc: any = allEntryDocs.find((doc) => path.basename(doc.id, '.md') == node.text);
      if (doc !== undefined) {
        node.url = '/entries/' + doc.slug;
      }
    }
    // uncomment if 'virtualTrunk' is set to 'false'
    // for (const node of bonsai.tree) {
    //   const doc: any = allIndexDocs.find((doc) => path.basename(doc.id, '.md') == node.text);
    //   if (doc !== undefined) {
    //     node.url = '/index/' + doc.slug;
    //   }
    // }
    // uncomment in case blog posts are desired on the #tag map
    // const allBlogDocs = await getCollection('blog');
    // for (const node of bonsai.tree) {
    //   const doc: any = allBlogDocs.find((doc) => path.basename(doc.id, '.md') == node.text);
    //   if (doc !== undefined) {
    //     node.url = '/blog/' + doc.slug;
    //   }
    // }
    return bonsai;
  } catch (e) {
    console.error(e, res);
  }
  if (bonsai.duplicates.length > 0) {
    console.log('bonsai duplicates: ' + bonsai.duplicates);
  } else {
    console.log('bonsai: \n'
      + 'res: ' + JSON.stringify(res) + '\n'
      + 'root: ' + bonsai.root + '\n'
      + 'duplicates: ' + bonsai.duplicates
    );
  }
}

export const bonsai = await buildBonsai();
