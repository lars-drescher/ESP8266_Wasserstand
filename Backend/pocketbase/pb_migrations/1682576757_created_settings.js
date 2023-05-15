migrate((db) => {
  const collection = new Collection({
    "id": "2kbiauyz6lgys4h",
    "created": "2023-04-27 06:25:57.994Z",
    "updated": "2023-04-27 06:25:57.994Z",
    "name": "settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pxfu1waf",
        "name": "pollingRate",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("2kbiauyz6lgys4h");

  return dao.deleteCollection(collection);
})
