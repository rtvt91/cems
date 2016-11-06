'use strict'

var CONFIG = (function(){

    return{
        TOKEN:{
            SECRET: "zdg687zd36zd54izd7458zdz4",
            EXPIRATION: "4h"
        },
        LANG: ['en'],
        URL_SEPARATOR: '-',
        DEFAULT_CATEGORY_NAME: 'default',
        FIRST_CATEGORY_NAME: 'cat1',
        SECOOND_CATEGORY_NAME: 'cat2',
        DEFAULT_ARTICLES_URL: ['my-first-article', 'my-second-article'],
        AUTHORIZED_HTML_TAG: ['article', 'footer', 'header','h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'section', 'div', 'li', 'ol', 'p', 'ul', 'a', 'br', 'b', 'span', 'u', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'img'],
        AUTHORIZED_HTML_ATTRIBUTE: ['id', 'class', 'src', 'alt', 'title'],
        AUTHORIZED_DIRECTIVES_ELEMENT: ['editable-img', 'article-info'],
        AUTHORIZED_DIRECTIVES_ATTRIBUTE: ['editableContent'],
        AUTHORIZED_IMAGE_EXTENSION: ['image/jpeg', 'image/png']
    };

}());

module.exports = CONFIG;