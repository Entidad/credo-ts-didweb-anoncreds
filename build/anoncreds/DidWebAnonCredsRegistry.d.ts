import { AnonCredsRegistry, GetCredentialDefinitionReturn, GetRevocationRegistryDefinitionReturn, GetRevocationStatusListReturn, GetSchemaReturn, RegisterCredentialDefinitionOptions, RegisterCredentialDefinitionReturn, RegisterRevocationRegistryDefinitionOptions, RegisterRevocationRegistryDefinitionReturn, RegisterRevocationStatusListOptions, RegisterRevocationStatusListReturn, RegisterSchemaOptions, RegisterSchemaReturn } from '@credo-ts/anoncreds';
import { AgentContext } from '@credo-ts/core';
export interface CacheSettings {
    allowCaching: boolean;
    cacheDurationInSeconds: number;
}
export declare class DidWebAnonCredsRegistry implements AnonCredsRegistry {
    readonly methodName = "web";
    readonly supportedIdentifier: RegExp;
    private cacheSettings;
    constructor(options?: {
        cacheOptions?: CacheSettings;
    });
    getSchema(agentContext: AgentContext, schemaId: string): Promise<GetSchemaReturn>;
    registerSchema(agentContext: AgentContext, options: RegisterSchemaOptions): Promise<RegisterSchemaReturn>;
    getCredentialDefinition(agentContext: AgentContext, credentialDefinitionId: string): Promise<GetCredentialDefinitionReturn>;
    registerCredentialDefinition(agentContext: AgentContext, options: RegisterCredentialDefinitionOptions): Promise<RegisterCredentialDefinitionReturn>;
    getRevocationRegistryDefinition(agentContext: AgentContext, revocationRegistryDefinitionId: string): Promise<GetRevocationRegistryDefinitionReturn>;
    registerRevocationRegistryDefinition(agentContext: AgentContext, options: RegisterRevocationRegistryDefinitionOptions): Promise<RegisterRevocationRegistryDefinitionReturn>;
    getRevocationStatusList(agentContext: AgentContext, revocationRegistryId: string, timestamp: number): Promise<GetRevocationStatusListReturn>;
    registerRevocationStatusList(agentContext: AgentContext, options: RegisterRevocationStatusListOptions): Promise<RegisterRevocationStatusListReturn>;
    private parseIdAndFetchResource;
}
