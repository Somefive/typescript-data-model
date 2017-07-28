# Data Model For Typescript
#### By Somefive

This library is used for created data model using Class Object based on Typescript. The data model uses decorators to decorate properties. Currently, there are two kinds of decorators: **Scenario** and **Validator**.

## Installing with npm
Run `npm install --save-dev typescript-data-model`.

Then use `import {Model, scenario, validate} from 'data-model'`

Notices: since this library use decorators and metadata which are experimental, `experimentalDecorators` and `emitDecoratorMetadata` should be enabled in `tsconfig.json` which means you should add
```json
"experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
"emitDecoratorMetadata": true         /* Enables experimental support for emitting type metadata for decorators. */
```
to your `tsconfig.json` file.

## Sample
Sample can be found in [sample/index.ts](./sample/index.ts). You can also run `npm run sample` to compile it into sample/dist and run it.

## Introduction

### Model
The **Model** class is the base class which can be extended while used. 

The property **scenario** indicates the current scenario of this model and the property **scenarioDefaultIncluded** decides whether a property should be available while there is no ScenarioFilter applied on it.

**isFieldAvailable** check if one specified field is available under current scenario.

**load** can be used to load properties if the property is available and exists in the given object. 

**toDocs** can publish current data model to object that contains specified available fields. If no fields specified then all
available fields are going to be published.

**validate** can validate specified available fields if validators are suppressed on them. If no fields specified then all available fields are going to be published.

*Watch out:* Each field should be initialized in constructor otherwise when it is not defined explicitly, the validation and scenario will not work on it.

### Scenario
The **ScenarioFilter** is composed of list of included and excluded scenarios. The **defaultIncluded** is set to decide whether 
the suppressed property is available if current scenario is neither in included list nor in excluded list.

For example, Model default scenario are set to be *default*, if *default* is in a property's excluded scenario list then it will be unavailable.

Scenarios can be enabled by adding **@scenario(scenarioFilter)** to a property. Such as
```javascript
@scenario(new ScenarioFilter(false, ["passwordEnabledScenario"]))
password: string
```

### Validation
The validation is based on interface **IValidator**. Validation will be used when Model call `validation` to check. If the property is not available then it will be skipped by the validation. 

Validation can be enabled by adding **@validation(iValidator)** to a property. Such as
```javascript
@validate(new RangeValidator(1,100))
age: number
```

There are several validator available in the library and you can also create you own validator just implement the IValidator interface.

**RegexValidator** is using RegExp to validate string.
**RangeValidator** is using min and max value to check number in range.
**ArrayValidator** validates arrays. It takes another validator to validate every item. The error will be displayed in object instead of array.
**NestedValidator** validates nested Model. You can specified what fields are to be validated in nested Model.
**ChainValidator** can chain validators.
**PredicateValidator** takes one predicate such as lambda expression to customize the validation which is a bit simplier than implementing a new validator.
**NotEmptyValidator** checks if string, array, object are empty or undefined.

