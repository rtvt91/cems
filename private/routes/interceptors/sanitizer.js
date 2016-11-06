'use strict'

var Utils = require('../../utils/utils'),
	CONFIG = require('../../config/config'),
	CONST = require('../../config/constant'),
	parseDataUrl = require('parse-data-url');

var Sanitizer = (function(){

	var _clean = function(req, res, next){

		var userInput = {},
			postInput = {},
			categoryInput = {},
			articleInput = {},
			imageInput = {};

		//Params
		if(Utils.keyInObject('params', req)){
			if(req.url.indexOf('/users/') > -1){
				if(Utils.keyInObject('params.user_id', req)){
					userInput.user_id = (Utils.isValidMongoId(req.params.user_id)) ? req.params.user_id : '';
				}
			}else if(req.url.indexOf('/posts/article-user-id/') > -1){
				if(Utils.keyInObject('params.user_id', req) && Utils.isValidMongoId(req.params.user_id)){
					postInput.user_id = req.params.user_id;
				}
			}else if(req.url.indexOf('/posts/article-category-name/') > -1){
				if(Utils.keyInObject('params.category_name', req) && Utils.isNotEmpty(req.params.category_name)){
					var escaped = Utils.escapeHTML(req.params.category_name.toLowerCase());
					escaped = Utils.removeDiacritics(escaped);
					escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						postInput.category_name = escaped;
					}
				}
			}else if(req.url.indexOf('/posts/article-url/') > -1){
				if(Utils.keyInObject('params.post_id', req) && Utils.isValidMongoId(req.params.post_id)){
					articleInput.post_id = req.params.post_id;
				}
				if(Utils.keyInObject('params', req) && Utils.isValidString(req.params[0]) && Utils.isValidString(req.params[1])){
					articleInput.categoryName = req.params[0];
					articleInput.url = req.params[1];
				}
			}else if(req.url.indexOf('/posts/') > -1){
				if(Utils.keyInObject('params.post_id', req) && Utils.isValidMongoId(req.params.post_id)){
					postInput.post_id = req.params.post_id;
				}
			}else if(req.url.indexOf('/categories/') > -1){
				if(Utils.keyInObject('params.category_id', req)){
					categoryInput.category_id = (Utils.isValidMongoId(req.params.category_id)) ? req.params.category_id : '';
				}
			}
		}

		//Body
		if(Utils.keyInObject('body', req)){

			if(req.url.indexOf('/users/') > -1 || req.url.indexOf('/login') > -1){
				if(Utils.keyInObject('body.email', req) && Utils.isNotEmpty(req.body.email)){
					userInput.email = (Utils.isValidEmail(req.body.email))? Utils.trim(req.body.email) : '';
				}
				if(Utils.keyInObject('body.password', req) && Utils.isNotEmpty(req.body.password) && Utils.isValidPassword(req.body.password)){
					userInput.password = Utils.escapeHTML(req.body.password);
				}
				if(Utils.keyInObject('body.password2', req) && Utils.isNotEmpty(req.body.password2) && Utils.isValidPassword(req.body.password2)){
					userInput.password2 = Utils.escapeHTML(req.body.password2);
				}
				if(Utils.keyInObject('body.newPassword', req) && Utils.isNotEmpty(req.body.newPassword) && Utils.isValidPassword(req.body.newPassword)){
					userInput.newPassword = Utils.escapeHTML(req.body.newPassword);
				}
				if(Utils.keyInObject('body.newPassword2', req) && Utils.isNotEmpty(req.body.newPassword2) && Utils.isValidPassword(req.body.newPassword2)){
					userInput.newPassword2 = Utils.escapeHTML(req.body.newPassword2);
				}
				if(Utils.keyInObject('body.firstname', req) && Utils.isNotEmpty(req.body.firstname)){
					userInput.firstname = Utils.escapeHTML(req.body.firstname);
				}
				if(Utils.keyInObject('body.lastname', req) && Utils.isNotEmpty(req.body.lastname)){
					userInput.lastname = Utils.escapeHTML(req.body.lastname);
				}
				if(Utils.keyInObject('body.active', req, true) && Utils.isBoolean(req.body.active)){
					userInput.active = Utils.toBoolean(req.body.active);
				}
			}else if(req.url.indexOf('/categories/') > -1){
				if(Utils.keyInObject('body.name', req) && Utils.isNotEmpty(req.body.name)){
					var escaped = Utils.escapeHTML(req.body.name.toLowerCase());
					escaped = Utils.removeDiacritics(escaped);
					escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						categoryInput.name = escaped;
					}
				}
				if(Utils.keyInObject('body.active', req, true) && Utils.isBoolean(req.body.active)){
					categoryInput.active = Utils.toBoolean(req.body.active);
				}
			}else if(req.url.indexOf('/posts/') > -1){	
				if(Utils.keyInObject('body.active', req, true) && Utils.isBoolean(req.body.active)){
					if(Utils.keyInObject('CEMS.jwt.role', req) === CONST.USER.ROLE.ADMIN){
						postInput.active = Utils.toBoolean(req.body.active);
					}
				}
				if(Utils.keyInObject('body.userId', req) && Utils.isValidMongoId(req.body.userId)){
					postInput.userId = req.body.userId;
				}
				if(Utils.keyInObject('body.categoryId', req) && Utils.isValidMongoId(req.body.categoryId)){
					postInput.categoryId = req.body.categoryId;
				}
				if(Utils.keyInObject('body.url', req) && Utils.isNotEmpty(req.body.url)){
					var escaped = Utils.escapeHTML(req.body.url.toLowerCase());
					escaped = Utils.removeDiacritics(escaped);
					escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						postInput.url = escaped;
					}
				}
				if(Utils.keyInObject('body.title', req) && Utils.isNotEmpty(req.body.title)){
					postInput.title = Utils.escapeHTML(req.body.title);
				}
				if(Utils.keyInObject('body.content', req)){
					postInput.content = Utils.htmlToCleanJsonDom(req.body.content);
					Utils.cleanUnusedImg(Utils.keyInObject('CEMS.jwt.validateDecodedToken.id', req));
				}
			}else if(req.url.indexOf('/save-img') > -1){
				if(Utils.keyInObject('body.postId', req) && Utils.isValidMongoId(req.body.postId)){
					imageInput.postId = req.body.postId;
				}
				if(Utils.keyInObject('body.title', req) && Utils.isNotEmpty(req.body.title)){
					var escaped = Utils.escapeHTML(req.body.title.toLowerCase());
					escaped = Utils.removeDiacritics(escaped);
					escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						imageInput.title = escaped;
					}
				}
				if(Utils.keyInObject('body.description', req) && Utils.isNotEmpty(req.body.description)){
					imageInput.description = Utils.escapeHTML(req.body.description.toLowerCase());
				}
				if(Utils.keyInObject('body.previousImgSrc', req) && Utils.isNotEmpty(req.body.previousImgSrc)){
					if(Utils.isValidImgUrl(req.body.previousImgSrc)){
						imageInput.previousImgSrc = req.body.previousImgSrc.split('?')[0].toLowerCase();						
					}
				}
				if(Utils.keyInObject('body.imgData', req)){
					var json = parseDataUrl(req.body.imgData);
					if(Utils.keyInObject('base64', json) && json.base64){
						if(Utils.keyInObject('mediaType', json) && Utils.isValidImageExtension(json.mediaType)){
							imageInput.imgData = json;
						}
					}
				}
			}else if(req.url.indexOf('/article-exists') > -1){
				if(Utils.keyInObject('body.category', req) && Utils.isNotEmpty(req.body.category)){
					var escaped = Utils.escapeHTML(req.body.category.toLowerCase());
						escaped = Utils.removeDiacritics(escaped);
						escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						postInput.category = escaped;
					}
				}
				if(Utils.keyInObject('body.article', req) && Utils.isNotEmpty(req.body.article)){
					var escaped = Utils.escapeHTML(req.body.article.toLowerCase());
						escaped = Utils.removeDiacritics(escaped);
						escaped = Utils.replaceForbiddenCharacterWith(escaped, CONFIG.URL_SEPARATOR);
					if(Utils.isValidString(escaped)){
						postInput.article = escaped;
					}
				}
			}else if(req.url.indexOf('/first-time/') > -1){
				if(Utils.keyInObject('body.email', req) && Utils.isNotEmpty(req.body.email)){
					userInput.email = (Utils.isValidEmail(req.body.email))? Utils.trim(req.body.email) : '';
				}
				if(Utils.keyInObject('body.password', req) && Utils.isNotEmpty(req.body.password) && Utils.isValidPassword(req.body.password)){
					userInput.password = Utils.escapeHTML(req.body.password);
				}
				if(Utils.keyInObject('body.password2', req) && Utils.isNotEmpty(req.body.password2) && Utils.isValidPassword(req.body.password2)){
					userInput.password2 = Utils.escapeHTML(req.body.password2);
				}
				if(Utils.keyInObject('body.firstname', req) && Utils.isNotEmpty(req.body.firstname)){
					userInput.firstname = Utils.escapeHTML(req.body.firstname);
				}
				if(Utils.keyInObject('body.lastname', req) && Utils.isNotEmpty(req.body.lastname)){
					userInput.lastname = Utils.escapeHTML(req.body.lastname);
				}
			}
		}

		delete req.params;
		delete req.body;

		if(req.CEMS){
			req.CEMS.userInput = userInput;
			req.CEMS.categoryInput = categoryInput;
			req.CEMS.postInput = postInput;
			req.CEMS.articleInput = articleInput;
			req.CEMS.imageInput = imageInput;
		}

		next();
	};

	return{
		clean: _clean
	};

}());

module.exports = Sanitizer;