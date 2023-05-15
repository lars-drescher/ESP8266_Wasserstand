migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

  // remove
  collection.schema.removeField("e6d4j2lx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5ey94h3t",
    "name": "time",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e6d4j2lx",
    "name": "time",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // remove
  collection.schema.removeField("5ey94h3t")

  return dao.saveCollection(collection)
})
