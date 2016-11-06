'use strict'

var chai = require('chai'),
    sinon = require('sinon'),
    path = require('path'),
    fs = require('fs'),
    Utils = require('../../utils/utils'),
    CONFIG = require('../../config/config'),
    expect = chai.expect;

describe('Utils', function(){

    describe('#trim method', function(){
        it('should trim empty string', function(){
            var emptyStr = "",
                spacedStr = "    ",
                str = "     hello world     super";
            expect(Utils.trim(emptyStr)).to.equal('');
            expect(Utils.trim(spacedStr)).to.equal('');
            expect(Utils.trim(str)).to.equal('hello world     super');
        });
    });

    describe('#conflictInUrl method', function(){
        it('should return false if there\'s no conflict', function(){
            var param = {
                _id: 123,
                catName: 'default',
                url: 'my-first-article',
                list: [{_id: 456, url: 'my-second-article', categoryId: {name: 'default'}}, {_id: 456, url: 'my-third-article', categoryId: {name: 'default'}}]
            };
            expect(Utils.conflictInUrl(param)).to.be.false;
        });

        it('should return true if there\'s a conflict', function(){
            var param = {_id: 123,
                catName: 'default',
                url: 'my-first-article',
                list: [{_id: 456, url: 'my-first-article', categoryId: {name: 'default'}}, {_id: 456, url: 'my-third-article', categoryId: {name: 'default'}}]
            };
            expect(Utils.conflictInUrl(param)).to.be.true;
        });
    });

    describe('#escapeHTML method', function(){
        it('should escape HTML entities', function(){
            var str = '<span>Hello</span>',
                escaped = Utils.escapeHTML(str);
            expect(escaped).to.equal('&lt;span&gt;Hello&lt;&#x2F;span&gt;');
        });

        it('should escape script tag', function(){
            var str = '<script src="http://www.malware.com"></script>',
                escaped = Utils.escapeHTML(str);
            expect(escaped).to.equal('&lt;script src=&quot;http:&#x2F;&#x2F;www.malware.com&quot;&gt;&lt;&#x2F;script&gt;');
        });
    });

    describe('#unEscapeHTML method', function(){
        it('should unescape html entities', function(){
            var str = '&lt;span&gt;Hello&lt;&#x2F;span&gt;',
                unEscaped = Utils.unEscapeHTML(str);
            expect(unEscaped).to.equal('<span>Hello</span>');
        });
    });

    describe('#replaceWhitespaceWith method', function(){
        it('should replace white space by a seed (in this test a dash)', function(){
            var str = '  hello  world       test',
                replaced = Utils.replaceWhitespaceWith(str, '-');
            expect(replaced).to.equal('--hello--world-------test');
        });
    });

    describe('#replaceForbiddenCharacterWith method', function(){
        it('should replace all special chars and white space by a seed (in this test a dash)', function(){
            var str = 'My name is : &&&é##~~+°*///€€ John',
                replaced = Utils.replaceForbiddenCharacterWith(str, '-');
            expect(replaced).to.equal('My-name-is-John');
        });
    });

    describe('#removeDiacritics method', function(){
        it('should convert all accentuated chars to its unaccented equivalent', function(){
            var str = 'äâ éèëê ïî öô üû',
                replaced = Utils.removeDiacritics(str);
            expect(replaced).to.equal('aa eeee ii oo uu');
        });
    });

    describe('#toBoolean method', function(){
        it('should transform string to Boolean', function(){
            var emptyStr = "",
            	whiteSpaceStr = " ",
                someStr = "hello",
                trueString = "true",
                falseString = "false";
            expect(Utils.toBoolean(emptyStr)).to.be.false;
            expect(Utils.toBoolean(whiteSpaceStr)).to.be.false;
            expect(Utils.toBoolean(someStr)).to.be.true;
            expect(Utils.toBoolean(trueString)).to.be.true;
            expect(Utils.toBoolean(falseString)).to.be.false;
        });
    });

    describe('#keyInObject method', function(){
        it('should retrieve value nested from a key in nested object', function(){
            var obj = {
                localisation: {
                    country:{
                        name: 'France',
                        city: {
                            name: 'Paris',
                            street: 'rue du général de gaulle'
                        }
                    }
                }
            };
            expect(Utils.keyInObject('localisation.country.name', obj)).to.equal('France');
            expect(Utils.keyInObject('localisation.country.city.name', obj)).to.equal('Paris');
            expect(Utils.keyInObject('localisation.country.city.number', obj)).to.equal(undefined);
        });
    });

    describe('#isNotEmpty method', function(){
        it('should detect empty string', function(){
            var emptyStr = "",
                spacedStr = "    ",
                str = "hello world";
            expect(Utils.isNotEmpty(emptyStr)).to.be.false;
            expect(Utils.isNotEmpty(spacedStr)).to.be.false;
            expect(Utils.isNotEmpty(str)).to.be.true;
        });
    });

    describe('#isBoolean method', function(){
        it('should check if string is a Boolean', function(){
            var emptyStr = "",
                whiteSpaceStr = " ",
                someStr = "hello",
                trueString = "true",
                falseString = "false";
            expect(Utils.isBoolean(emptyStr)).to.be.false;
            expect(Utils.isBoolean(whiteSpaceStr)).to.be.false;
            expect(Utils.isBoolean(someStr)).to.be.false;
            expect(Utils.isBoolean(trueString)).to.be.true;
            expect(Utils.isBoolean(falseString)).to.be.true;
        });
    });

    describe('#isValidEmail method', function(){
        it('should valid email', function(){
            var invalidEmail = "test.test.com.ru",
                validEmail = "test@test.com";
            expect(Utils.isValidEmail(invalidEmail)).to.be.false;
            expect(Utils.isValidEmail(validEmail)).to.be.true;
        });
    });

    describe('#isValidPassword method', function(){
        it('should valid password (8 or + characters, 1 or+ lowercase, 1 or+ uppercase, 1 or+ numeric, 1 or+ special character)', function(){
            var invalidPassword = "password",
                validPassword = "P@ssw0rd";
            expect(Utils.isValidPassword(invalidPassword)).to.be.false;
            expect(Utils.isValidPassword(validPassword)).to.be.true;
        });
    });

    describe('#isValidMongoId method', function(){
        it('should valid mongo id', function(){
            var invalidId = "23145645456",
                validId = "562bbdb1a261ab0c10e2781a";
            expect(Utils.isValidMongoId(invalidId)).to.be.false;
            expect(Utils.isValidMongoId(validId)).to.be.true;
        });
    });

    describe('#isDefaultCategory method', function(){
        it('should return true if the passed str is the default category', function(){
            expect(Utils.isDefaultCategory(CONFIG.DEFAULT_CATEGORY_NAME)).to.be.true;
            expect(Utils.isDefaultCategory('CONFIG.DEFAULT_CATEGORY_NAME')).to.be.false;
        });
    });

    describe('#isValidImgUrl method', function(){
        it('should valid the passed url', function(){
            expect(Utils.isValidImgUrl('img/post/default/default.jpg?54841545121545614')).to.be.true;
            expect(Utils.isValidImgUrl('img/post/default/default.jpg')).to.be.true;
            expect(Utils.isValidImgUrl('123/hello%20/#test')).to.be.false;
        });
    });

    describe('#isValidString method', function(){
        it('should valid a string that contain only letter, number, dash and underscore', function(){
            expect(Utils.isValidString('hello_world-and_hi-999')).to.be.true;
            expect(Utils.isValidString('hello world')).to.be.false;
            expect(Utils.isValidString('J\'étais à Paris!!#paris' )).to.be.false;
        });
    });

    describe('#isValidImageExtension method', function(){
        it('should valid the image extensions define in the CONFIG.AUTHORIZED_IMAGE_EXTENSION constant', function(){
            expect(Utils.isValidImageExtension('image/jpeg')).to.be.true;
            expect(Utils.isValidImageExtension('image/png')).to.be.true;
            expect(Utils.isValidImageExtension('image/gif')).to.be.false;
            expect(Utils.isValidImageExtension('image/bmp')).to.be.false;
            expect(Utils.isValidImageExtension('application/json')).to.be.false;
        });
    });

    describe('#htmlToCleanJsonDom method', function(){
        it('should transform html to json and clean it from unwanted tags and elements', function(){
            var html = '<div><p>hello world</p></div>',
                script = '<div onclick="function(){alert(\'hello\');}><p>hello world</p></div>',
                unwantedClass = '<div ng-class="ng-pristine ng-valid ng-not-empty ng-touched"><p medium-editor>hello world</p></div>',
                resultHtml = [{"tagName":"div","attributes":{},"children":[{"tagName":"p","attributes":{},"children":[{"content":"hello world","type":"Text"}],"type":"Element"}],"type":"Element"}],
                resultScript = [{"tagName":"div","attributes":{},"children":[{"content":"nclick=&quot;function(){alert(&#x27;hello&#x27;);}&gt;","type":"Text"},{"tagName":"p","attributes":{},"children":[{"content":"hello world","type":"Text"}],"type":"Element"}],"type":"Element"}];
            expect(Utils.htmlToCleanJsonDom(html)).to.deep.equal(resultHtml);
            expect(Utils.htmlToCleanJsonDom(script)).to.deep.equal(resultScript);
            expect(Utils.htmlToCleanJsonDom(unwantedClass)).to.deep.equal(resultHtml);
        });
    });

    describe('#findTagnameInJSON method', function(){
        var json = [{"tagName":"div","attributes":{},"children":[{"tagName":"p","attributes":{},"children":[{"content":"hello world","type":"Text"}],"type":"Element"}],"type":"Element"}];
        it('should find a tagname in a json format and return it', function(){
            var result = [{tagName: 'p', content: 'hello world', children: undefined, simpleText: true}];
            expect(Utils.findTagnameInJSON('p', json)).to.deep.equal(result);
        });

        it('should return an empty array if no tagname has been found', function(){
            expect(Utils.findTagnameInJSON('img', json)).to.be.empty;
        });
    });

    describe('#fileExists method', function(){
        it('should return true if the file exists at a specific path', function(){
            var thePath = path.join(__dirname, 'utils-spec.js');
            expect(Utils.fileExists(thePath)).to.be.true;
        });

        it('should return false if the file doesn\'t exist at a specific path', function(){
            var thePath = path.join(__dirname, 'utils');
            expect(Utils.fileExists(thePath)).to.be.false;
        });
    });

    describe('#createFolder method', function(){
        var thePath = path.join(__dirname, 'test_create_folder');
        it('should create a folder at a specific path if it doesn\'t exist', function(done){
            Utils.createFolder(thePath);
            fs.stat(thePath, function(err, stats){
                expect(err).to.be.null;
                expect(stats).to.be.defined;
                done();
            });
        });

        it('should not create a new folder at a specific path if it does exist', function(done){
            Utils.createFolder(thePath);
            fs.stat(thePath, function(err, stats){
                expect(err).to.be.null;
                expect(stats).to.be.defined;
                fs.rmdirSync(thePath);
                done();
            });
        });
    });

    describe('#createImage method', function(){
        it('should create an image at a specific path', function(done){
            var param = {
                url: path.join(__dirname, 'test-img.png'),
                buffer: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
            };
            Utils.createImage(param, function(err){
                expect(err).to.be.undefined;
                expect(Utils.fileExists(param.url)).to.be.true;
                fs.unlinkSync(param.url);
                done();
            });
        });
    });

    describe('#cleanUnusedImg method', function(){
        it('should clean all unused img in the temp folder or the specific folder path as parameter', function(done){
            var param = {
                url: path.join(__dirname, './123_test-img.png'),
                buffer: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
            };
            Utils.createImage(param, function(err){
                Utils.cleanUnusedImg('123', path.join(__dirname, './'))
                expect(Utils.fileExists(param.url)).to.be.false;
                done();
            });
        });
    });

    describe('#getFullURL method', function(){
        it('should return a complete url', function(){
            expect(Utils.getFullURL({protocol: 'http', hostname: '127.0.0.1'})).to.equal('http://127.0.0.1');
        });
    });

});
