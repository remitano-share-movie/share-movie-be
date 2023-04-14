module.exports =  class ValidateService{
  constructor(form){
      this.form = form;
      this.errors = {}
  }

  addErrorForm = (newError) => {
      let newKey = Object.keys(newError)[0]
      if (!!this.errors[newKey]) {
          this.errors[newKey].push(newError[newKey])
      }
      else {
          this.errors[newKey] = [newError[newKey]]
      }
      return this.errors
  }

  validateEmail(){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!this.form.email) {
          this.errors = this.addErrorForm({ email: "Email is required" })
      }
      else if (!re.test(String(this.form.email).toLowerCase())){
          this.errors = this.addErrorForm({email: "Email invalid"})
      }
  }

  validatePassword(){
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;
      const pw = this.form.password;

      if (!this.form.password){
          this.errors = this.addErrorForm({password: "Password is required"})
      }
      if (!/^.{5,}$/.test(pw)){
          this.errors = this.addErrorForm({password: "Password needs to be longer than 4 characters"})
      }
      if (!/^(?=.*[a-z])/.test(pw)){
          this.errors = this.addErrorForm({password: "Password contains lowercase letters"})
      }
      if (!/^(?=.*[A-Z])/.test(pw)){
          this.errors =this.addErrorForm({password: "Password contains uppercase letters"})
      }
      if (!/^(?=.*\d)/.test(pw)){
          this.errors = this.addErrorForm({password: "Password contains digits"})
      }
      if (!/^(?=.*(\W|_))/.test(pw)){
          this.errors = this.addErrorForm({password: "Password contains special characters"})
      }
  }

  validateLink(){
    const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    if (!re.test(this.form.film_link)) {
        this.errors =this.addErrorForm({film_link: `${this.form.film_link} is not a link`})
    }
  }

  formLogin(){
      this.validateEmail()
      return this.errors
  }

  formRegister(){
      this.validateEmail()
      this.validatePassword()
      return this.errors
  }

  required(keys){
      keys.forEach(key => {
          if (!this.form[key]) 
              this.errors = this.addErrorForm({[key]: ":key invalid".replace(":key", key[0].toUpperCase()+key.slice(1, key.length))})
      })
  }

  hasError(){
      if (Object.keys(this.errors).length > 0) return true;
      else return false
  }

}