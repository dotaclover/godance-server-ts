import { Client } from '@elastic/elasticsearch';
import config from '../bootstrap/config';

export class ElasticSearchService {
    private client: Client;

    constructor(node: string, username?: string, password?: string) {
        this.client = new Client({
            node,
            auth: username && password ? { username, password } : undefined,
            tls: {
                ca: [],
                rejectUnauthorized: false,
            },
        });
    }

    // 创建索引
    async createIndex(index: string, mappings: Record<string, any>) {
        try {
            const exists = await this.client.indices.exists({ index });
            if (!exists) {
                await this.client.indices.create({
                    index,
                    body: {
                        mappings,
                    },
                });
            }
        } catch (error) {
            console.error(`Failed to create index: ${index}`, error);
        }
    }

    // 检查索引是否存在
    async indexExists(index: string): Promise<boolean> {
        return await this.client.indices.exists({ index });
    }

    // 删除索引
    async deleteIndex(index: string): Promise<void> {
        await this.client.indices.delete({ index });
    }

    // 插入文档
    async insertDocument<T>(index: string, document: T, id?: string) {
        try {
            const response = await this.client.index({
                index,
                id,
                body: document,
                refresh: 'true', // 立即更新索引
            });
            return response;
        } catch (error) {
            console.error(`Failed to insert document into ${index}`, error);
        }
    }

    // 搜索文档
    async search<T>(index: string, query: object): Promise<T[]> {
        const body = await this.client.search({
            index,
            body: {
                query,
            },
        });
        return body.hits.hits.map((hit: any) => hit._source);
    }

    // 删除文档
    async deleteDocument(index: string, id: string): Promise<void> {
        await this.client.delete({
            index,
            id,
            refresh: "wait_for",
        });
    }

    // 更新文档
    async updateDocument<T>(index: string, id: string, partialDocument: Partial<T>) {
        try {
            const response = await this.client.update({
                index,
                id,
                body: {
                    doc: partialDocument,
                },
                refresh: "wait_for"

            });
            return response;
        } catch (error) {
            console.error(`Failed to update document in ${index}`, error);
        }
    }

    // 测试连接
    async testConnection(): Promise<boolean> {
        try {
            const response = await this.client.ping();
            console.log("Elasticsearch connection successful:", response);
            return response; // 返回布尔值 true 或 false
        } catch (error) {
            console.error("Elasticsearch connection failed:", error);
            return false;
        }
    }
}

const cfg = config.get('elasticSearch') as {
    node: string;
    auth: {
        username: string;
        password: string;
    }
};
const elasticsearch = new ElasticSearchService(cfg.node, cfg.auth.username, cfg.auth.password);
export default elasticsearch;
