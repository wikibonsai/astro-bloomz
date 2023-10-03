import { getCollection } from 'astro:content';

import path from 'path';
import * as wikirefs from 'wikirefs';


export async function generateBackRefs(thisFileName: string) {
  const blogrefs = generateBlogBackRefs(thisFileName);
  const entryrefs = generateEntryBackRefs(thisFileName);
  return {
    backattrs: { ...(await blogrefs).backattrs, ...(await entryrefs).backattrs },
    backlinks: [...(await blogrefs).backlinks, ...(await entryrefs).backlinks],
  }
}

// note: the following functions perform identical
//       tasks, but operate on different collections

export async function generateBlogBackRefs(thisFileName: string) {
  const backattrs: any = {};
  const backlinks: any = [];
  const allBlogPosts = await getCollection('blog');
  for (const thatDoc of allBlogPosts) {
    const thatFName: string = path.basename(thatDoc.id, '.md');
    if (thatFName === thisFileName) { continue; }
    const wiki = wikirefs.scan(thatDoc.body);
    for (const w of wiki) {
      if (w.kind === wikirefs.CONST.WIKI.ATTR) {
        // @ts-expect-error
        for (const fname of w.filenames) {
          const fnameStr: string = fname[0];
          // @ts-expect-error
          const typeStr: string = w.type[0];
          if (fnameStr === thisFileName) {
            if (!Object.keys(backattrs).includes(typeStr)) {
              backattrs[typeStr] = [];
            }
            backattrs[typeStr].push({
              filenames: thatFName,
              htmlHref: '/blog/' + thatDoc.slug,
              htmlText: thatFName,
            });
          }
        }
      }
      if (w.kind === wikirefs.CONST.WIKI.LINK) {
        // @ts-expect-error
        const fnameStr: string = w.filename[0];
        // @ts-expect-error
        const typeStr: string = w.type[0];
        if (fnameStr === thisFileName) {
          backlinks.push({
            linktype: typeStr,
            htmlHref: '/blog/' + thatDoc.slug,
            htmlText: thatFName,
          });
        }
      }
    }
  }
  return {
    backattrs,
    backlinks,
  }
}

export async function generateEntryBackRefs(thisFileName: string) {
  const backattrs: any = {};
  const backlinks: any = [];
  const allEntryDocs = await getCollection('entries');
  for (const thatDoc of allEntryDocs) {
    const thatFName: string = path.basename(thatDoc.id, '.md');
    if (thatFName === thisFileName) { continue; }
    const wiki = wikirefs.scan(thatDoc.body);
    for (const w of wiki) {
      if (w.kind === wikirefs.CONST.WIKI.ATTR) {
        // @ts-expect-error
        for (const fname of w.filenames) {
          const fnameStr: string = fname[0];
          // @ts-expect-error
          const typeStr: string = w.type[0];
          if (fnameStr === thisFileName) {
            if (!Object.keys(backattrs).includes(typeStr)) {
              backattrs[typeStr] = [];
            }
            backattrs[typeStr].push({
              filenames: thatFName,
              htmlHref: '/entries/' + thatDoc.slug,
              htmlText: thatFName,
            });
          }
        }
      }
      if (w.kind === wikirefs.CONST.WIKI.LINK) {
        // @ts-expect-error
        const fnameStr: string = w.filename[0];
        // @ts-expect-error
        const typeStr: string = w.type[0];
        if (fnameStr === thisFileName) {
          backlinks.push({
            linktype: typeStr,
            htmlHref: '/entries/' + thatDoc.slug,
            htmlText: thatFName,
          });
        }
      }
    }
  }
  return {
    backattrs,
    backlinks,
  }
}

