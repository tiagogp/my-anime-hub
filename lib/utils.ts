import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertValuesToURLSearchParams(params: any) {
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlSearchParams.append(key, value as string);
  });

  return urlSearchParams.toString();
}

export function paginate(dataLength: number, correctPage: number, perPage = 10) {
  const pages = Array.from(
    { length: dataLength },
    (_, i) => i + 1
  );

  const results = pages.reduce((acc, _, index, array) => {
    if (index % perPage === 0) {
      acc.push(array.slice(index, index + perPage));
    }
    return acc;
  }, [] as number[][]);

  const actualPageIndex = results.findIndex((page) =>
    page.includes(Number(correctPage))
  );

  const result = pages.length > perPage ? results[actualPageIndex] : results[0];

  return result;
}


type NavItemsProps = {
  icon: JSX.Element;
  title: string;
  href: string;
  alternativePath?: string;
  disabled?: boolean;
}[]



export const getActiveNavItemIndex = (navItems: NavItemsProps, correctedPath: string, pathname: string) => {
  const reduced = navItems.reduce((acc, item, index) => {
    const corrected = item.href.split('/').length > 1 ? item.href.split('/').filter(item => item !== '')[0] : item.href

    if (corrected === correctedPath) {
      acc = index
    }

    if (corrected !== correctedPath && item?.alternativePath === pathname) {
      acc = index
    }
    return acc
  }, 0)

  return reduced;
};