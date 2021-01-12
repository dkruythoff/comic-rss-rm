const { mkdirSync, writeFileSync } = require("fs");
const { JSDOM } = require("jsdom");
const { Feed } = require("feed");

const baseUrl = 'https://www.redmeat.com/'

JSDOM.fromURL(`${baseUrl}max-cannon/MeatLocker?sortType=date&index=20`, {
  referrer: `${baseUrl}max-cannon/MeatLocker`
}).then(dom => {
  const { document } = dom.window

  const feed = new Feed({
    title: document.querySelector('title').textContent.split(' | ')[1],
    description: 'The most tasteless and twisted comic strip in the world. From the secret files of Max Cannon.',
    id: baseUrl,
    link: baseUrl,
    image: `${baseUrl}image.png`,
    favicon: `${baseUrl}favicon.ico`,
    copyright: document.querySelector('#footerCopyright').textContent.replace(/\n/g, '').replace(/\s+/g, ' ').trim()[0],
    generator: 'Feed for Node.js'
  });

  Array.from(document.querySelectorAll('.archiveListing')).forEach(itemElement => {
    const title = itemElement.querySelector('.headline a').textContent
    const url = itemElement.querySelector('.headline a').getAttribute('href')
    const imageThumb = itemElement.querySelector('.archiveImage img').getAttribute('src')
    const imageFull = imageThumb.replace('/story', '/redmeat')
    const date = itemElement.querySelector('.releasedate').textContent

    feed.addItem({
      title,
      id: url,
      link: url,
      description: `<img src="${imageFull}" />`,
      date: new Date(date),
      image: imageThumb
    });
  })

  mkdirSync('./public')
  writeFileSync('./public/feed.rss', feed.rss2())
});