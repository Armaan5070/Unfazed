export const generateSlug = ()=>{
        return text
            .toString()
            .toLowerCase()                        // Convert to lowercase
            .trim()                               // Remove whitespace from both ends
            .replace(/[^a-z0-9\s-]/g, '')         // Remove all non-alphanumeric characters (except spaces/hyphens)
            .replace(/[\s_]+/g, '-')              // Replace spaces and underscores with a single hyphen
            .replace(/-+/g, '-');                 // Remove consecutive hyphens   
}