import { CheerioCrawler, Dataset } from 'crawlee';


let totalItems = 0;
let clients = [];
const cheerioCrawler = new CheerioCrawler({
    maxRequestsPerCrawl: 20,
    async requestHandler({ $, request, enqueueLinks, log }) {

        const clientsCount = $('.list-wrapper').find('.col-lg-4').length;
        for (let index = 0; index < clientsCount; index++) {
            const name = $('.list-item-heading').eq(index).text().trim();
            const annotation = $('.list-item-anotation').eq(index).text().trim();
            const content = $('.overlay-txt.ddd').eq(index).text().trim();
            const link = $('.overlay-link a').eq(index).attr('href').trim();
            const image = $('.list-item-image').eq(index).attr('data-src').trim();

            clients.push({ 'Name': name, 'Annotation': annotation, 'Content': content, 'Link': link, 'Image': image });
        }

        totalItems += clientsCount;

        // the enqueueLinks will find new links of a page based on the selector we've provided. and then push
        // those links to the RequestQueue for later processing
        await enqueueLinks({
            // globs: ['http[s?]://www.dmpublishing.cz/en/references\?p.Page=[0-9]{1,}'],
            selector: '.pagination a',
            exclude: ['https://www.dmpublishing.cz/en/references?p.Page=1']
        });
    }
})

// Every crawler has an implicit RequestQueue instance, and you can add requests to it with the crawler.addRequests() method. In fact,
// you can go even further and just use the first parameter of crawler.run()
await cheerioCrawler.run(['https://www.dmpublishing.cz/en/references']);

// save scraped data in JSON format
await Dataset.pushData({ 'TotalItems': totalItems, 'Clients': clients });