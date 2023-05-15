migrate((db) => {
  const collection = new Collection({
    "id": "bkp1watujjs0ct9",
    "created": "2023-04-26 10:25:04.555Z",
    "updated": "2023-04-26 10:25:04.555Z",
    "name": "waterLevels",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
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
  const collection = dao.findCollectionByNameOrId("bkp1watujjs0ct9");

  return dao.deleteCollection(collection);
})
