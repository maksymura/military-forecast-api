import { join } from "path";

export const DOCS_PATH = join(process.cwd(), "documents");
export const RESULTS_PATH = join(process.cwd(), "results");

export const baseUrl = "https://www.understandingwar.org/";

export const publicationsUrl =
  baseUrl +
  "publications?type%5B%5D=backgrounder&type%5B%5D=map&type%5B%5D=other_work&type%5B%5D=report&tid%5B%5D=336&tid%5B%5D=300&field_lastname_value=&sort_by=created&sort_order=DESC";
