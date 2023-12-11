import { BASE_URL } from '@/config/constants'

import parse from "node-html-parser"

export async function GET() {
  // const browser = await puppeteer.launch({
  //   args: [
  //     "--no-sandbox",
  //     "--disable-setuid-sandbox",
  //     "--single-process",
  //     "--no-zygote",
  //   ],
  //   executablePath: process.env.NODE_ENV === "production" ? "/usr/bin/google-chrome-stable" : puppeteer.executablePath(),
  //   headless: "new",
  // });

  // const [page] = await browser.pages();
  // await page.goto(BASE_URL, {
  //   waitUntil: "load",
  // });

  const data = await fetch(BASE_URL)

  const html = await data.text()

  const docHtml = parse(html)

  const videos = docHtml.querySelectorAll("article")

  // const html = await page.$$eval("article", (elements) => {
  //   return elements.map((element) => ({
  //     title: element.querySelector(".card-title h2")?.textContent?.trim() ?? element.querySelector(".card-title h1")?.textContent?.trim() ?? null,
  //     episode: Number(element.querySelector(".card-title span")?.textContent?.replace(/[^\d]/g, "") ?? 0
  //     ),
  //     url: element.querySelector("a")?.getAttribute("href") ?? "",
  //     image: element.querySelector("img")?.getAttribute("src") ?? "",
  //     description: element.querySelector("p")?.textContent ?? "",
  //     views: 0,
  //     createdAt: new Date().toISOString(),
  //   }));
  // });


  const contentVideos = await Promise.all(
    Array.from(videos).map(async (item: any) => {
      const slug =
        item.querySelector("a")?.getAttribute("href")

      const properties = {
        title: item.querySelector(".card-title h2")?.textContent?.trim() ?? item.querySelector(".card-title h1")?.textContent?.trim() ?? null,
        episode: Number(item.querySelector(".card-title span")?.textContent?.replace(/[^\d]/g, "") ?? 0
        ),
        url: item.querySelector("a")?.getAttribute("href") ?? "",
        image: item.querySelector("img")?.getAttribute("src") ?? "",
        description: item.querySelector("p")?.textContent ?? "",
        views: 0,
        createdAt: new Date().toISOString(),
      }


      return properties
    })
  )
  // await browser.close();

  // const result = contentVideos.filter((item) => item.url?.includes("video"))

  // const videos = docHtml.querySelectorAll("article")

  // const contentVideos = await Promise.all(
  //   Array.from(videos).map(async (item: any) => {
  //     const slug =
  //       item.querySelector("a")?.textContent ?? null



  //     const properties = {
  //       title: item.querySelector(".card-title h2")?.textContent ?? null,
  //       episode:
  //         item.querySelector(".card-title")?.textContent ?? 0
  //       ,
  //       isDubbed: slug?.includes("dublado") ?? false,
  //       slug,
  //       url: item.querySelector("a")?.getAttribute("href") ?? "",
  //       image: item.querySelector("img")?.getAttribute("src") ?? "",
  //       description: item.querySelector("p")?.textContent ?? "",
  //       views: 0,
  //       createdAt: new Date().toISOString(),
  //       item: item.getAttribute("href") ?? "",
  //     }

  //     // if (properties?.title != null) {
  //     //   const adminRef = doc(db, "animes", properties.slug)
  //     //   await setDoc(adminRef, properties)
  //     // }

  //     return properties
  //   })

  // )


  return Response.json({ contentVideos })
}