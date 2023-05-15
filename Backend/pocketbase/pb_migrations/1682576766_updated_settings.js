migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2kbiauyz6lgys4h")

  collection.name = "config"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2kbiauyz6lgys4h")

  collection.name = "settings"

  return dao.saveCollection(collection)
})
