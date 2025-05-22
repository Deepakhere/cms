const generateHTMLContent = (formData) => {
    const { title, subtext, bodyContent, showAuthor, files } = formData;

    const htmlTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body>
            <p>${subtext}</p>
            <div>
            ${bodyContent}
            <img src="${files}" alt="Image here"/>
            </div>
            <div>${"Author Name " + showAuthor}</div>

        </body>
        </html>
    `;

    return htmlTemplate;
};
export default generateHTMLContent;