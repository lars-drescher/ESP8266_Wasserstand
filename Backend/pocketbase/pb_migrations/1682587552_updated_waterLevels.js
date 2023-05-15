migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

  // remove
  collection.schema.removeField("5ey94h3t")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ivxxyht4",
    "name": "timeStamp",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9")

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

  // remove
  collection.schema.removeField("ivxxyht4")

  return dao.saveCollection(collection)
})
