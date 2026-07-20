import { RepositoryResolver } from "@/lib/infrastructure/persistence/resolver/RepositoryResolver";
import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { getRawProducts, Product } from "./collections";

export type Tag = {
  id: string;
  name: string;
  productCount?: number; // Calculated dynamically
};

export async function getTags(): Promise<Tag[]> {
  try {
    const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
    const data = await docRepo.getDocument("tags");
    return (data as Tag[]) || [];
  } catch (err) {
    return [];
  }
}

export async function saveTags(tags: Tag[]): Promise<void> {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  await docRepo.saveDocument("tags", tags);
}

export async function addTag(name: string): Promise<Tag> {
  const tags = await getTags();
  const normalized = name.trim().toLowerCase();
  
  let existing = tags.find(t => t.name === normalized);
  if (existing) return existing;
  
  const newTag: Tag = {
    id: `tag_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: normalized
  };
  
  tags.push(newTag);
  await saveTags(tags);
  return newTag;
}

export async function deleteTag(id: string): Promise<void> {
  const tags = await getTags();
  const tagToDelete = tags.find(t => t.id === id);
  if (!tagToDelete) return;
  
  const newTags = tags.filter(t => t.id !== id);
  await saveTags(newTags);
  
  // Update products to remove this tag
  await removeTagFromProducts(tagToDelete.name);
}

export async function renameTag(id: string, newName: string): Promise<void> {
  const tags = await getTags();
  const tag = tags.find(t => t.id === id);
  if (!tag) throw new Error("Tag not found");
  
  const normalized = newName.trim().toLowerCase();
  
  // Check if target name already exists (if so, we should merge)
  if (tags.some(t => t.id !== id && t.name === normalized)) {
    throw new Error("A tag with this name already exists. Please use merge instead.");
  }
  
  const oldName = tag.name;
  tag.name = normalized;
  await saveTags(tags);
  
  // Update products
  await renameTagInProducts(oldName, normalized);
}

export async function mergeTags(sourceId: string, targetId: string): Promise<void> {
  const tags = await getTags();
  const source = tags.find(t => t.id === sourceId);
  const target = tags.find(t => t.id === targetId);
  
  if (!source || !target) throw new Error("Source or target tag not found");
  
  // Delete source tag
  const newTags = tags.filter(t => t.id !== sourceId);
  await saveTags(newTags);
  
  // Update products
  await mergeTagInProducts(source.name, target.name);
}

// ─── Product Updates ──────────────────────────────────────────────

async function updateProductsFile(products: Product[]): Promise<void> {
  const docRepo = RepositoryResolver.resolve<IDocumentRepository>("IDocumentRepository");
  await docRepo.saveDocument("products", products);
}

async function removeTagFromProducts(tagName: string): Promise<void> {
  const products = await getRawProducts();
  let changed = false;
  
  const updated = products.map(p => {
    if (p.tags && p.tags.includes(tagName)) {
      p.tags = p.tags.filter(t => t !== tagName);
      changed = true;
    }
    return p;
  });
  
  if (changed) await updateProductsFile(updated);
}

async function renameTagInProducts(oldName: string, newName: string): Promise<void> {
  const products = await getRawProducts();
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
  
  if (changed) await updateProductsFile(updated);
}

async function mergeTagInProducts(sourceName: string, targetName: string): Promise<void> {
  // Essentially the same as renaming, because it replaces source with target
  await renameTagInProducts(sourceName, targetName);
}
