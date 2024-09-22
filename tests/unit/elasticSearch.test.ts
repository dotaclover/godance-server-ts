import service from '../../src/services/elasticSearch';

service.testConnection().then(success => {
    if (success) {
        console.log('Connected to Elasticsearch successfully!');
    } else {
        console.log('Failed to connect to Elasticsearch.');
    }
});

describe('ElasticSearchService', () => {
    const testTitle = 'GoDanceTest' + Date.now();
    const testIndex = 'test_index';
    const testDocument = {
        title: testTitle,
        description: 'This is a test document',
        date: new Date(),
    };
    let documentId: string;

    beforeAll(async () => {
        const exists = await service.indexExists(testIndex);

        if (!exists) {
            await service.createIndex(testIndex, {
                properties: {
                    title: { type: 'text' },
                    description: { type: 'text' },
                    date: { type: 'date' },
                },
            });
        }
    });

    afterAll(async () => {
        // await service.deleteIndex(testIndex);
    });

    it('should create an index', async () => {
        const exists = await service.indexExists(testIndex);
        expect(exists).toBe(true);
    });

    it('should insert a document', async () => {
        const response = await service.insertDocument(testIndex, testDocument);
        expect(response).toHaveProperty('result', 'created');
        documentId = response!._id;
    });

    it('should search for a document', async () => {
        const results = await service.search(testIndex, {
            match: { title: testTitle },
        });
        expect(results.length).toBeGreaterThan(0);

        const expectedDocument = {
            ...testDocument,
            date: testDocument.date.toISOString(),// ISO date string
        };

        expect(results[0]).toEqual(expect.objectContaining(expectedDocument));
    });

    it('should update a document', async () => {
        const updatedContent = { description: 'Updated description for the test document' };
        const response = await service.updateDocument(testIndex, documentId, updatedContent);
        expect(response).toHaveProperty('result', 'updated');

        const updatedResults = await service.search<{ description: string }>(testIndex, {
            match: { title: testTitle },
        });

        const expectedUpdatedDocument = {
            ...testDocument,
            description: updatedContent.description,
            date: testDocument.date.toISOString(),
        };

        expect(updatedResults[0]).toEqual(expect.objectContaining(expectedUpdatedDocument));
    });


    it('should delete a document', async () => {
        await service.deleteDocument(testIndex, documentId);

        const results = await service.search(testIndex, {
            match: { title: testTitle },
        });

        expect(results.length).toBe(0);
    });

});