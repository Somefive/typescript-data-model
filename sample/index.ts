import {Model} from '../src/model'
import {validate, ValidationError, IValidator, NestedValidator, RangeValidator, 
    PredicateValidator, ArrayValidator, RegexValidator, ChainValidator, NotEmptyValidator} from '../src/validator'
import {scenario, ScenarioFilter} from '../src/scenario'
import { I18NString, I18N } from '../src/i18n'
import { generateFieldFilter, ExtendFieldFilter} from '../src/field'

/** You can create your own validator implements IValidator */
class MyValidator implements IValidator {
    errorMessage: string
    constructor(errorMessage: string = "my error message") {
        this.errorMessage = errorMessage
    }
    validate(obj: Object): ValidationError {
        return ((obj as string).length > 15) ? this.errorMessage : undefined
    }
}

/** A simple nested model. */
class Name extends Model {
    
    @validate(new ChainValidator(new NotEmptyValidator(), new PredicateValidator(obj => (obj as string).length <= 15)))
    firstName: string
    
    @validate(new MyValidator())
    lastName: string
    
    constructor(firstName: string="", lastName: string="") {
        super()
        this.firstName = firstName
        this.lastName = lastName
    }

    get fullName() {
        return `${this.lastName} ${this.firstName}`
    }

    toDocs(fields?: string[]): Object {
        const parentResult = super.toDocs(fields)
        return {...parentResult, fullName: this.fullName}
    }
}
class User extends Model {

    @validate(new NestedValidator(["firstName", "lastName"]))
    name: Name

    @validate(new RangeValidator(1,100))
    age: number

    static UserScenario: string = "user"

    get fieldNamesLangPack() { 
        return {
            password: {
                en: "user password",
                zh: "密码"
            }
        }
    }

    @validate(new PredicateValidator(obj => (obj as string[]).length > 0, "At least one contact."),
               new ArrayValidator(new RegexValidator(/[0-9]{6,15}/)))
    @scenario(new ScenarioFilter(true, [], [User.UserScenario]))
    contact: string[]

    @validate(new NotEmptyValidator({en: "Password cannot be empty.", zh: "密码不能为空"}))
    @scenario(new ScenarioFilter(false, [User.UserScenario]))
    password: string

    constructor(name: Name|null=null, age: number=18, contact: string[]=[]) {
        super()
        this.name = name || new Name()
        this.age = age
        this.contact = contact
        this.password = ""
    }
}
const user = new User()
/** load simple object data */
user.load({
    name: {
        firstName: "Snow",
        lastName: "John"
    },
    contact: ["123456789", "134"]
})
/** this gives a brief overview of the user object */
console.log("Full user:\n", user)
/** only contact['1'] validation failed */
console.log("Validation:\n", user.validate())
console.log("Publish Doc:\n", user.toDocs())
user.scenario = User.UserScenario
/** contact is ignored and password is checked now */
console.log("Validation after change scenario:\n", I18N.t(user.validate(), "zh"))
user.password = "userpass"
/** now published doc does not have contact but has password */
console.log("Doc after change scenario\n", user.toDocs())

const i18NObject = {
    name: "John Snow",
    occupation: {
        en: "Nights Watch",
        zh: "守夜人"
    }
}
/** Try I18N translation */
console.log("I18N translation:", I18N.t(i18NObject, "zh"))

/** Try generate filter by generateFieldFilter */
const fieldsFilter = ["id", "profiles.id", "profiles.name", "!profiles.age"]
console.log("FieldFilter generate:", generateFieldFilter(fieldsFilter))

/** Try output field names */
console.log(user.fieldNames(undefined, "zh"))