"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResourceId = exports.calculateResourceId = void 0;
const core_1 = require("@credo-ts/core");
const canonicalize_1 = __importDefault(require("canonicalize"));
function calculateResourceId(resourceObjectValue) {
    const objectString = (0, canonicalize_1.default)(resourceObjectValue);
    if (!objectString) {
        throw new Error('Cannot canonicalize resource object');
    }
    return core_1.TypedArrayEncoder.toBase58(core_1.Hasher.hash(core_1.TypedArrayEncoder.fromString(objectString), 'sha-256'));
}
exports.calculateResourceId = calculateResourceId;
function verifyResourceId(resourceObjectValue, resourceId) {
    return calculateResourceId(resourceObjectValue) === resourceId;
}
exports.verifyResourceId = verifyResourceId;
//# sourceMappingURL=utils.js.map