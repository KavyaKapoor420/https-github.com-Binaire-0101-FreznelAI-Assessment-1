import { deleteDB, openDB } from "idb";
import Model from "../components/Models/Model.js";

const DATABASE_NAME = "binaire-model-cache";
const DATABASE_VERSION = 1;
const MODELS_STORE = "models";
const METADATA_STORE = "metadata";
const METADATA_KEY = "sync";

export class ModelCache {
  constructor(databaseName = DATABASE_NAME) {
    this.databaseName = databaseName;
    this.databasePromise = openDB(this.databaseName, DATABASE_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(MODELS_STORE)) {
          database.createObjectStore(MODELS_STORE, { keyPath: "id" });
        }

        if (!database.objectStoreNames.contains(METADATA_STORE)) {
          database.createObjectStore(METADATA_STORE);
        }
      },
    });
  }

  getModels() {
    return this.databasePromise
      .then((database) => database.getAll(MODELS_STORE))
      .then((records) => records.map((record) => new Model(record.raw || record)));
  }

  getMetadata() {
    return this.databasePromise.then((database) => database.get(METADATA_STORE, METADATA_KEY));
  }

  saveModels(models, { allowEmpty = false } = {}) {
    const normalizedModels = models.map((model) => (model instanceof Model ? model : new Model(model)));
    return this.getMetadata().then((previousMetadata) => {
      if (!allowEmpty && normalizedModels.length === 0 && previousMetadata?.recordCount > 0) {
        throw new Error("The new model dataset was empty, so the existing cache was preserved");
      }

      return this.databasePromise.then((database) => {
        const transaction = database.transaction([MODELS_STORE, METADATA_STORE], "readwrite");
        const modelStore = transaction.objectStore(MODELS_STORE);
        const metadataStore = transaction.objectStore(METADATA_STORE);

        return modelStore
          .clear()
          .then(() => Promise.all(normalizedModels.map((model) => modelStore.put(model.toJSON()))))
          .then(() =>
            metadataStore.put(
              {
                lastSuccessfulSync: new Date().toISOString(),
                recordCount: normalizedModels.length,
                cacheVersion: DATABASE_VERSION,
              },
              METADATA_KEY
            )
          )
          .then(() => transaction.done);
      });
    });
  }

  clearModels() {
    return this.databasePromise.then((database) =>
      database.transaction([MODELS_STORE, METADATA_STORE], "readwrite").objectStore(MODELS_STORE).clear()
    );
  }

  clearCache() {
    return this.databasePromise.then(() => deleteDB(this.databaseName));
  }
}

export default ModelCache;
