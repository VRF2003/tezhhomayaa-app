import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { getRawProducts, Product } from "./collections";

export type Tag = {
  id: string;
  name: string;
  productCount?: number; // Calculated dynamically
};

const tagsPath = join(process.cwd(), "lib", "tags.json");

function ensureTagsFile() {
  if (!existsSync(tagsPath)) {
    writeFileSync(tagsPath, JSON.stringify([], null, 2));
  }
}

export function getTags(): Tag[] {
  ensureTagsFile();
  try {
    const raw = readFileSync(tagsPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveTags(tags: Tag[]) {
  writeFileSync(tagsPath, JSON.stringify(tags, null, 2));
}

export function addTag(name: string): Tag {
  const tags = getTags();
  const normalized = name.trim().toLowerCase();
  
  let existing = tags.find(t => t.name === normalized);
  if (existing) return existing;
  
  const newTag: Tag = {
    id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: normalized
  };
  
  tags.push(newTag);
  saveTags(tags);
  return newTag;
}

export function deleteTag(id: string) {
  const tags = getTags();
  const tagToDelete = tags.find(t => t.id === id);
  if (!tagToDelete) return;
  
  const newTags = tags.filter(t => t.id !== id);
  saveTags(newTags);
  
  // Update products to remove this tag
  removeTagFromProducts(tagToDelete.name);
}

export function renameTag(id: string, newName: string) {
  const tags = getTags();
  const tag = tags.find(t => t.id === id);
  if (!tag) throw new Error("Tag not found");
  
  const normalized = newName.trim().toLowerCase();
  
  // Check if target name already exists (if so, we should merge)
  if (tags.some(t => t.id !== id && t.name === normalized)) {
    throw new Error("A tag with this name already exists. Please use merge instead.");
  }
  
  const oldName = tag.name;
  tag.name = normalized;
  saveTags(tags);
  
  // Update products
  renameTagInProducts(oldName, normalized);
}

export function mergeTags(sourceId: string, targetId: string) {
  const tags = getTags();
  const source = tags.find(t => t.id === sourceId);
  const target = tags.find(t => t.id === targetId);
  
  if (!source || !target) throw new Error("Source or target tag not found");
  
  // Delete source tag
  const newTags = tags.filter(t => t.id !== sourceId);
  saveTags(newTags);
  
  // Update products
  mergeTagInProducts(source.name, target.name);
}

// ─── Product Updates ──────────────────────────────────────────────

function updateProductsFile(products: Product[]) {
  const productsPath = join(process.cwd(), "lib", "products.json");
  writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

function removeTagFromProducts(tagName: string) {
  const products = getRawProducts();
  let changed = false;
  
  const updated = products.map(p => {
    if (p.tags && p.tags.includes(tagName)) {
      p.tags = p.tags.filter(t => t !== tagName);
      changed = true;
    }
    return p;
  });
  
  if (changed) updateProductsFile(updated);
}

function renameTagInProducts(oldName: string, newName: string) {
  const products = getRawProducts();
  let changed = false;
  
  const updated = products.map(p => {
    if (p.tags && p.tags.includes(oldName)) {
      p.tags = p.tags.filter(t => t !== oldName);
      if (!p.tags.includes(newName)) {
        p.tags.push(newName);
      }
      changed = true;
    }
    return p;
  });
  
  if (changed) updateProductsFile(updated);
}

function mergeTagInProducts(sourceName: string, targetName: string) {
  // Essentially the same as renaming, because it replaces source with target
  renameTagInProducts(sourceName, targetName);
}
