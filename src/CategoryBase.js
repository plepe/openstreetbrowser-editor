const nameFieldDef = require('./nameFieldDef')

class CategoryBase {
  constructor (options) {
    this.options = options
  }

  formDef (data) {
    var ret = {
      "name": nameFieldDef(data.name)
    }

    return ret
  }
}

module.exports = CategoryBase
