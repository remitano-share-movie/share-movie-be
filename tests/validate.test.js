const ValidateService = require('../src/services/validate.service')

describe('Should', () => {
  describe('required attribute', ()=> {
    test('be existent', () => {
      const custom_object = {name: 'Me', age: 23, gender: 'male'};
      const validate = new ValidateService(custom_object)
      validate.required(['name'])

      expect(validate.hasError()).toEqual(false);
    })

    test('be non-existent', () => {
      const custom_object = {name: 'Me', age: 23, gender: 'male'};
      const validate = new ValidateService(custom_object)
      validate.required(['email'])

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"email": ["Email invalid"]})
    })
  })

  describe('validate', () => {
    test('email', () => {
      const temp_mail = 'abc@gmail.com';
      const validate = new ValidateService({email: temp_mail});
      validate.validateEmail()

      expect(validate.hasError()).toEqual(false);
    })

    test('non-email', () => {
      const temp_mail = 'abc//gmail.com';
      const validate = new ValidateService({email: temp_mail});
      validate.validateEmail()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"email": ["Email invalid"]})
    })

    test('password longer than 4 characters, contained uppercase, lowercase, digit, special characters', () => {
      const temmp_password = 'Abc123@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(false);
    })

    test('password less than 5 characters', () => {
      const temmp_password = 'Ab1@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"password": ["Password needs to be longer than 4 characters"]})
    })

    test('password do not contain lowercase', () => {
      const temmp_password = 'A111@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"password": ["Password contains lowercase letters"]})
    })

    test('password do not contain uppercase', () => {
      const temmp_password = 'a111@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"password": ["Password contains uppercase letters"]})
    })

    test('password do not contain digit', () => {
      const temmp_password = 'Aaaa@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"password": ["Password contains digits"]})
    })

    test('password do not contain special character', () => {
      const temmp_password = 'A111a';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors).toEqual({"password": ["Password contains special characters"]})
    })

    test('password do not contain lower and upper character', () => {
      const temmp_password = '@111@';
      const validate = new ValidateService({password: temmp_password});
      validate.validatePassword()

      expect(validate.hasError()).toEqual(true);
      expect(validate.errors.password).toContain("Password contains lowercase letters");
      expect(validate.errors.password).toContain("Password contains uppercase letters");
    })

    test('http/https link', () => {
      const http_link = 'http://localhost.com';
      const https_link = 'https://localhost.com';
      const validate_http = new ValidateService({film_link: http_link});
      const validate_https = new ValidateService({film_link: https_link});
      validate_http.validateLink()
      validate_https.validateLink()

      expect(validate_http.hasError()).toEqual(false);
      expect(validate_https.hasError()).toEqual(false);
    })

    test('non http/https link', () => {
      const http_link = 'abclink';
      const https_link = 'xyz_link';
      const validate_http = new ValidateService({film_link: http_link});
      const validate_https = new ValidateService({film_link: https_link});
      validate_http.validateLink()
      validate_https.validateLink()

      expect(validate_http.hasError()).toEqual(true);
      expect(validate_http.errors).toEqual({"film_link": [`${http_link} is not a link`]})
      expect(validate_https.hasError()).toEqual(true);
      expect(validate_https.errors).toEqual({"film_link": [`${https_link} is not a link`]})
    })
  })
})