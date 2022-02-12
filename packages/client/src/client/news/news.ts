import { News } from "../../api/interfaces/news";

export class NewsItem {
  constructor(protected readonly news: News) {}

  getBody() { return this.news.copy }
  getHeadline() { return this.news.headline }
  getImage() { return this.news.image }
  getUrl() { return this.news.url }
  getId() { return this.news.id }
  getTime() { return new Date(this.news.stamp) }
}
