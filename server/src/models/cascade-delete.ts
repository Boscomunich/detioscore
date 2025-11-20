import mongoose, { Schema } from "mongoose";

export interface CascadeRelation {
  model: string;
  field: string;
  // Optional: path to the model file if needed
  importPath?: string;
}

export interface CascadeOptions {
  related: CascadeRelation[];
}

export function cascadeDeletePlugin(schema: Schema, options: CascadeOptions) {
  const related = options?.related || [];

  async function handleCascadeDelete(this: any, next: Function) {
    const docId = this.getQuery()?._id;
    if (!docId) return next();

    try {
      for (const relation of related) {
        let RelatedModel;

        try {
          // Try to get the model if already registered
          RelatedModel = mongoose.model(relation.model);
        } catch (err) {
          // If not registered, dynamically import it
          if (relation.importPath) {
            // Use require for CommonJS
            RelatedModel = require(relation.importPath).default;
          } else {
            console.warn(
              `Related model "${relation.model}" is not registered and no importPath provided.`
            );
            continue;
          }
        }

        if (RelatedModel) {
          await RelatedModel.deleteMany({ [relation.field]: docId });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  // For findOneAndDelete()
  schema.pre("findOneAndDelete", handleCascadeDelete);

  // For deleteOne()
  schema.pre(
    "deleteOne",
    { document: false, query: true },
    handleCascadeDelete
  );
}
