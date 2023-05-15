migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rar9j9xv",
    "name": "waterLevel",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 0,
      "max": 100
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rar9j9xv",
    "name": "waterLevel",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
