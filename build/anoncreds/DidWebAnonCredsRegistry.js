"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidWebAnonCredsRegistry = void 0;
const core_1 = require("@credo-ts/core");
const query_string_1 = require("query-string");
const utils_1 = require("./utils");
class DidWebAnonCredsRegistry {
    constructor(options) {
        var _a;
        this.methodName = 'web';
        this.supportedIdentifier = /^did:web:[_a-z0-9.%A-]*/;
        this.cacheSettings = (_a = options === null || options === void 0 ? void 0 : options.cacheOptions) !== null && _a !== void 0 ? _a : { allowCaching: true, cacheDurationInSeconds: 300 };
    }
    async getSchema(agentContext, schemaId) {
        const cacheKey = `anoncreds:schema:${schemaId}`;
        if (this.cacheSettings.allowCaching) {
            const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
            const cachedObject = await cache.get(agentContext, cacheKey);
            if (cachedObject) {
                return {
                    schema: cachedObject.schema,
                    schemaId,
                    schemaMetadata: cachedObject.schemaMetadata,
                    resolutionMetadata: Object.assign(Object.assign({}, cachedObject.resolutionMetadata), { servedFromCache: true }),
                };
            }
        }
        try {
            const { response, resourceId, did } = await this.parseIdAndFetchResource(agentContext, schemaId);
            if (response.status === 200) {
                const result = (await response.json());
                const schema = result.resource;
                const schemaMetadata = result.resourceMetadata;
                if (!(0, utils_1.verifyResourceId)(schema, resourceId)) {
                    throw new Error('Wrong resource Id');
                }
                if (did !== schema.issuerId) {
                    throw new Error(`issuerId in schema (${schema.issuerId}) does not match the did (${did})`);
                }
                if (this.cacheSettings.allowCaching) {
                    const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
                    await cache.set(agentContext, cacheKey, {
                        resolutionMetadata: {},
                        schema,
                        schemaMetadata,
                    }, this.cacheSettings.cacheDurationInSeconds);
                }
                return {
                    schemaId,
                    schema,
                    schemaMetadata,
                    resolutionMetadata: {},
                };
            }
            else {
                agentContext.config.logger.debug(`response: ${response.status}`);
                return {
                    resolutionMetadata: { error: 'notFound' },
                    schemaMetadata: {},
                    schemaId,
                };
            }
        }
        catch (error) {
            agentContext.config.logger.debug(`Error resolving schema with id ${schemaId}: ${error}`, { error });
            return {
                resolutionMetadata: { error: 'invalid', message: error instanceof Error ? error.message : `${error}` },
                schemaMetadata: {},
                schemaId,
            };
        }
    }
    async registerSchema(agentContext, options) {
        // Nothing to actually do other than generating a schema id
        const resourceId = (0, utils_1.calculateResourceId)(options.schema);
        const schemaId = `${options.schema.issuerId}?service=anoncreds&relativeRef=/schema/${resourceId}`;
        return {
            schemaState: { state: 'finished', schema: options.schema, schemaId },
            registrationMetadata: {},
            schemaMetadata: {},
        };
    }
    async getCredentialDefinition(agentContext, credentialDefinitionId) {
        const cacheKey = `anoncreds:credentialDefinition:${credentialDefinitionId}`;
        if (this.cacheSettings.allowCaching) {
            const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
            const cachedObject = await cache.get(agentContext, cacheKey);
            if (cachedObject) {
                return {
                    credentialDefinition: cachedObject.credentialDefinition,
                    credentialDefinitionId,
                    credentialDefinitionMetadata: cachedObject.credentialDefinitionMetadata,
                    resolutionMetadata: Object.assign(Object.assign({}, cachedObject.resolutionMetadata), { servedFromCache: true }),
                };
            }
        }
        try {
            const { response, resourceId, did } = await this.parseIdAndFetchResource(agentContext, credentialDefinitionId);
            if (response.status === 200) {
                const result = (await response.json());
                const credentialDefinition = result.resource;
                const credentialDefinitionMetadata = result.resourceMetadata;
                if (!(0, utils_1.verifyResourceId)(credentialDefinition, resourceId)) {
                    throw new Error('Wrong resource Id');
                }
                if (did !== credentialDefinition.issuerId) {
                    throw new Error(`issuerId in credential definition (${credentialDefinition.issuerId}) does not match the did (${did})`);
                }
                if (this.cacheSettings.allowCaching) {
                    const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
                    await cache.set(agentContext, cacheKey, {
                        resolutionMetadata: {},
                        credentialDefinition,
                        credentialDefinitionMetadata,
                    }, this.cacheSettings.cacheDurationInSeconds);
                }
                return {
                    credentialDefinitionId,
                    credentialDefinition,
                    credentialDefinitionMetadata,
                    resolutionMetadata: {},
                };
            }
            else {
                agentContext.config.logger.debug(`response: ${response.status}`);
                return {
                    resolutionMetadata: { error: 'notFound' },
                    credentialDefinitionMetadata: {},
                    credentialDefinitionId,
                };
            }
        }
        catch (error) {
            agentContext.config.logger.debug(`Error resolving schema with id ${credentialDefinitionId}: ${error}`, {
                error,
            });
            return {
                resolutionMetadata: { error: 'invalid', message: error instanceof Error ? error.message : `${error}` },
                credentialDefinitionMetadata: {},
                credentialDefinitionId,
            };
        }
    }
    async registerCredentialDefinition(agentContext, options) {
        // Nothing to actually do other than generating a credential definition id
        const resourceId = (0, utils_1.calculateResourceId)(options.credentialDefinition);
        const credentialDefinitionId = `${options.credentialDefinition.issuerId}?service=anoncreds&relativeRef=/credDef/${resourceId}`;
        return {
            credentialDefinitionState: {
                state: 'finished',
                credentialDefinition: options.credentialDefinition,
                credentialDefinitionId,
            },
            credentialDefinitionMetadata: {},
            registrationMetadata: {},
        };
    }
    async getRevocationRegistryDefinition(agentContext, revocationRegistryDefinitionId) {
        const cacheKey = `anoncreds:revocationRegistryDefinition:${revocationRegistryDefinitionId}`;
        if (this.cacheSettings.allowCaching) {
            const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
            const cachedObject = await cache.get(agentContext, cacheKey);
            if (cachedObject) {
                return {
                    revocationRegistryDefinition: cachedObject.revocationRegistryDefinition,
                    revocationRegistryDefinitionId,
                    revocationRegistryDefinitionMetadata: cachedObject.revocationRegistryDefinitionMetadata,
                    resolutionMetadata: Object.assign(Object.assign({}, cachedObject.resolutionMetadata), { servedFromCache: true }),
                };
            }
        }
        try {
            const { response, resourceId, did } = await this.parseIdAndFetchResource(agentContext, revocationRegistryDefinitionId);
            if (response.status === 200) {
                const result = (await response.json());
                const revocationRegistryDefinition = result.resource;
                const revocationRegistryDefinitionMetadata = result.resourceMetadata;
                if (!(0, utils_1.verifyResourceId)(revocationRegistryDefinition, resourceId)) {
                    throw new Error('Wrong resource Id');
                }
                if (did !== revocationRegistryDefinition.issuerId) {
                    throw new Error(`issuerId in revocation registry definition (${revocationRegistryDefinition.issuerId}) does not match the did (${did})`);
                }
                if (this.cacheSettings.allowCaching) {
                    const cache = agentContext.dependencyManager.resolve(core_1.CacheModuleConfig).cache;
                    await cache.set(agentContext, cacheKey, {
                        resolutionMetadata: {},
                        revocationRegistryDefinition,
                        revocationRegistryDefinitionMetadata,
                    }, this.cacheSettings.cacheDurationInSeconds);
                }
                return {
                    revocationRegistryDefinitionId,
                    revocationRegistryDefinition,
                    revocationRegistryDefinitionMetadata,
                    resolutionMetadata: {},
                };
            }
            else {
                agentContext.config.logger.debug(`response: ${response.status}`);
                return {
                    resolutionMetadata: { error: 'notFound' },
                    revocationRegistryDefinitionMetadata: {},
                    revocationRegistryDefinitionId,
                };
            }
        }
        catch (error) {
            agentContext.config.logger.debug(`Error resolving schema with id ${revocationRegistryDefinitionId}: ${error}`, {
                error,
            });
            return {
                resolutionMetadata: { error: 'invalid', message: error instanceof Error ? error.message : `${error}` },
                revocationRegistryDefinitionMetadata: {},
                revocationRegistryDefinitionId,
            };
        }
    }
    async registerRevocationRegistryDefinition(agentContext, options) {
        // Nothing to actually do other than generating a revocation registry definition id
        const resourceId = (0, utils_1.calculateResourceId)(options.revocationRegistryDefinition);
        const revocationRegistryDefinitionId = `${options.revocationRegistryDefinition.issuerId}?service=anoncreds&relativeRef=/revRegDef/${resourceId}`;
        return {
            revocationRegistryDefinitionState: {
                state: 'finished',
                revocationRegistryDefinition: options.revocationRegistryDefinition,
                revocationRegistryDefinitionId,
            },
            registrationMetadata: {},
            revocationRegistryDefinitionMetadata: {},
        };
    }
    async getRevocationStatusList(agentContext, revocationRegistryId, timestamp) {
        try {
            // TODO: use cache to get Revocation Registry Definition data without fetching it again
            const revRegDefResult = await this.getRevocationRegistryDefinition(agentContext, revocationRegistryId);
            if (!revRegDefResult.revocationRegistryDefinition) {
                throw new Error(`Error resolving revocation registry definition with id ${revocationRegistryId}. ${revRegDefResult.resolutionMetadata.error} ${revRegDefResult.resolutionMetadata.message}`);
            }
            const baseEndpoint = revRegDefResult.revocationRegistryDefinitionMetadata.statusListEndpoint;
            if (!baseEndpoint) {
                throw new Error(`No revocation status list endpoint has been found for ${revocationRegistryId}`);
            }
            const response = await agentContext.config.agentDependencies.fetch(`${baseEndpoint}/${timestamp}`, {
                method: 'GET',
            });
            if (response.status === 200) {
                const result = (await response.json());
                const revocationStatusList = result.resource;
                const revocationStatusListMetadata = result.resourceMetadata;
                if (revocationStatusList.issuerId !== revRegDefResult.revocationRegistryDefinition.issuerId) {
                    throw new Error(`issuerId in revocation status list (${revocationStatusList.issuerId}) does not match the issuer in the revocation registry definition (${revRegDefResult.revocationRegistryDefinition.issuerId})`);
                }
                return {
                    revocationStatusList,
                    revocationStatusListMetadata,
                    resolutionMetadata: {},
                };
            }
            else {
                agentContext.config.logger.debug(`response: ${response.status}`);
                return {
                    resolutionMetadata: { error: 'notFound' },
                    revocationStatusListMetadata: {},
                };
            }
        }
        catch (error) {
            return {
                resolutionMetadata: { error: 'invalid' },
                revocationStatusListMetadata: {},
            };
        }
    }
    async registerRevocationStatusList(agentContext, options) {
        var _a;
        // Nothing to actually do other than adding a timestamp
        const timestamp = Math.floor(new Date().getTime() / 1000);
        const latestRevocationStatusList = await this.getRevocationStatusList(agentContext, options.revocationStatusList.revRegDefId, timestamp);
        return {
            revocationStatusListState: {
                state: 'finished',
                revocationStatusList: Object.assign(Object.assign({}, options.revocationStatusList), { timestamp }),
            },
            registrationMetadata: {},
            revocationStatusListMetadata: {
                previousVersionId: ((_a = latestRevocationStatusList.revocationStatusList) === null || _a === void 0 ? void 0 : _a.timestamp.toString()) || '',
                nextVersionId: '',
            },
        };
    }
    async parseIdAndFetchResource(agentContext, didUrl) {
        var _a, _b;
        const parsedDid = (0, core_1.parseDid)(didUrl);
        if (!parsedDid) {
            throw new Error(`${didUrl} is not a valid resource identifier`);
        }
        if (parsedDid.method != 'web') {
            throw new Error('DidWebAnonCredsRegistry only supports did:web identifiers');
        }
        const didsApi = agentContext.dependencyManager.resolve(core_1.DidsApi);
        const didDocument = await didsApi.resolveDidDocument(parsedDid.did);
        const parsedUrl = (0, query_string_1.parseUrl)(didUrl);
        const queriedService = parsedUrl.query['service'];
        const relativeRef = parsedUrl.query['relativeRef'];
        if (!queriedService || Array.isArray(queriedService)) {
            throw new Error('No valid service query present in the ID');
        }
        if (!relativeRef || Array.isArray(relativeRef)) {
            throw new Error('No valid relativeRef query present in the ID');
        }
        // The last segment of relativeRef is the resourceId
        const resourceId = relativeRef.split('/').pop();
        if (!resourceId) {
            throw new Error('Could not get resourceId from relativeRef');
        }
        const baseEndpoint = (_b = (_a = didDocument.service) === null || _a === void 0 ? void 0 : _a.find((service) => service.id === `${parsedDid.did}#${queriedService}`)) === null || _b === void 0 ? void 0 : _b.serviceEndpoint;
        if (!baseEndpoint) {
            throw new Error(`No valid endpoint has been found for the service ${queriedService}`);
        }
        const fetchResourceUrl = `${baseEndpoint}${relativeRef}`;
        agentContext.config.logger.debug(`getting AnonCreds resource at URL: ${fetchResourceUrl}`);
        return {
            response: await agentContext.config.agentDependencies.fetch(fetchResourceUrl, { method: 'GET' }),
            resourceId,
            did: parsedDid.did,
        };
    }
}
exports.DidWebAnonCredsRegistry = DidWebAnonCredsRegistry;
//# sourceMappingURL=DidWebAnonCredsRegistry.js.map