const sort = () => {
    for (let part of article.article_content) {
        switch (part.type) {
            case 'H2':
                if (lastUsedH2 == true) {
                    htmlBlocks += '</section>';
                    if (lastUsedH3 == true) {
                        htmlBlocks += '</section>';
                        lastUsedH3 = false;
                    }
                }
                htmlBlocks += '<section>';
                htmlBlocks += part.html;
                lastUsedH2 = true;
                break;
            case 'H3':
                if (lastUsedH3 == true) {
                    htmlBlocks += '</section>';
                }
                htmlBlocks += '<section>';
                htmlBlocks += part.html;
                lastUsedH3 = true;
                break;
            case 'image':
                let extra = '',
                    content = part.content;
                if (!content) return;
                if (content.imgSrc) {
                    extra += `<div class="holder-img-src holder-som"><i>Source: ${content.imgSrc}</i></div>`;
                } if (content.seoImportant === true) {
                    imagesArticle.push({
                        "@type": "imageObject",
                        "url": `https://d.novoresume.com/images/blogs/${content.articleID}/${content.url}`,
                        "height": content.height,
                        "width": content.width,
                        "description": content.altText
                    });
                }
                content.altText = content.altText.replace(/"/g, '');
                if (isAMP == true) {
                    htmlBlocks +=
                        `<div class="art-img${content.width > 900 ? ' amp-add-border' : ''}">` +
                        `<amp-img src="<cdn-location/>/images/blogs/${content.articleID}/${content.url}" width="${content.width}" height="${content.height}" alt="${content.altText}" layout="responsive"></amp-img>` +
                        extra +
                        `</div>`;
                } else if (content.seoImportant === true) {
                    htmlBlocks +=
                        `<div class="art-img">` +
                        `<img src="<cdn-location/>/images/blogs/${content.articleID}/${content.url}" alt="${content.altText}"/>` +
                        extra +
                        `</div>`;
                } else {
                    htmlBlocks +=
                        `<div class="art-img">` +
                        `<div class="pre-wait-img" data-src="<cdn-location/>/images/blogs/${content.articleID}/${content.url}" data-alt="${content.altText}"></div>` +
                        extra +
                        `</div>`;
                }
                break;
            case 'list-simple':
                htmlBlocks += '<section class="list-simple">' +
                    `<h4>${part.simple.header}</h4>` +
                    part.simple.html +
                    '</section>'
                break;
            case 'list-pos':
                htmlBlocks += '<section class="list-pos">' +
                    `<h4>${part.pos.header}</h4>` +
                    part.pos.html +
                    '</section>'
                break;
            case 'list-neg':
                htmlBlocks += '<section class="list-neg">' +
                    `<h4>${part.neg.header}</h4>` +
                    part.neg.html +
                    '</section>'
                break;
            case 'list-pos-neg':
                htmlBlocks += '<div class="row">' +
                    '<section class="list-pos hf-left">' +
                    `<h4>${part.pos.header}</h4>` +
                    part.pos.html +
                    '</section>' +
                    '<section class="list-neg hf-right">' +
                    `<h4> ${part.neg.header}</h4> ` +
                    part.neg.html +
                    '</section>' +
                    '</div>';
                break;
            case 'text':
                htmlBlocks += part.html;
                break;
            case 'simple-ctr':
                htmlBlocks += `<div class="btn-art-simple-ctr"><a href="https://novoresume.com/${part.href}">${part.text}</a></div>`;
                break;
        }
        firstElementInserted = true;
    }
}



convert = () => {
    let list = [];
    let objBlock = {};
    for (let i = 0; i < content.length; i++) {
        const element = content[i];
        if (element.type === 'H2' || element.type === 'H3' || element.type === 'text') {
            objBlock = { type: "text-block", content: element.html };
            list.push(objBlock);
        } else if (
            element.type === 'list-pos-neg') {
            objBlock = { type: "list-pos-neg", content: element[Object.keys(element)[1]] };
            list.push(objBlock);
        } else if (element.type === 'list-pos') {
            objBlock = { type: "list-pos", content: element[Object.keys(element)[1]] };
            list.push(objBlock);
        } else if (element.type === 'list-neg') {
            objBlock = { type: "list-neg", content: element[Object.keys(element)[1]] };
            list.push(objBlock);
        } else if (element.type === 'list-simple') {
            objBlock = { type: "list-simple", content: element[Object.keys(element)[1]] };
            list.push(objBlock);
        } else if (element.type === 'image') {
            let content = element.content;
            if (!content)
                return;
            objBlock = { type: "image-block", content: content };
            list.push(objBlock);
        } else if (element.type === 'simple-btn') {
            objBlock = { type: "btn-simple", content: element[Object.keys(element)[1]] };
            list.push(objBlock);
        }
    }
}


            // switch (element.type) {
            //     case 'H2':
            //     case 'H3':
            //     case 'text':
            //         block += element.html;
            //         objBlock = { type: "text-block", content: element.html };
            //     case 'list-pos':
            //         objBlock = { type: 'list-pos', content: element[Object.keys(element)[1]] };
            //     case 'list-neg':
            //         objBlock = { type: 'list-neg', content: element[Object.keys(element)[1]] };
            //     case 'list-pos-neg':
            //         objBlock = { type: 'list-pos-neg', content: element[Object.keys(element)[1]] };
            //     case 'list-simple':
            //         let header = element[Object.keys(element)[1]].header;
            //         let html = element[Object.keys(element)[1]].html;
            //         block += `<h4>${header}</h4>${html}`;
            //         objBlock = { type: 'list-simple', content: element[Object.keys(element)[1]] };
            //     case 'image':
            //         let content = element.content;
            //         objBlock = { type: "image-block", content: content };
            //         if (!content)
            //             return;
            //         if (content.seoImportant === true) {
            //             block +=
            //                 `<div class="art-img">` +
            //                 `<img src="https://d.novoresume.com/images/blogs/${content.articleID}/${content.url}" alt="${content.altText}"/>` +
            //                 `</div>`;
            //         }
            //     case 'simple-crt':
            //         let href = element[Object.keys(element)[1]].href;
            //         let text = element[Object.keys(element)[1]].text;
            //         block += `<div class="btn-art-simple-ctr"><a href="https://novoresume.com/${href}">${text}</a></div>`;
            //         objBlock = { type: "ctr-simple", content: element[Object.keys(element)[1]] };
            // }