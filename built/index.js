"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var gitlab_js_1 = require("./sync/gitlab.js");
var gitlabSyncConfigKey = 'gitlab-sync:config';
var gitlabSyncLastCommitKey = 'gitlab-sync:lastCommit';
var defaultConfig = '{"api_url": "", "token": "", "id_project": 0, "files": ["workspace.json"], "branch": "master"}';
function fetchOrSetConfig(context) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 5]);
                    return [4 /*yield*/, loadConfig(context)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_1 = _a.sent();
                    return [4 /*yield*/, context.store.setItem(gitlabSyncConfigKey, defaultConfig)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loadConfig(context)];
                case 4: return [2 /*return*/, _a.sent()];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function loadConfig(context) {
    return __awaiter(this, void 0, void 0, function () {
        var configStorage, cfg, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.store.getItem(gitlabSyncConfigKey)];
                case 1:
                    configStorage = _a.sent();
                    if (configStorage === null) {
                        throw "Unable to fetch config";
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 3, , 5]);
                    cfg = JSON.parse(configStorage);
                    cfg.api_url = cfg.api_url.replace(/\/\s*$/, "");
                    return [2 /*return*/, cfg];
                case 3:
                    e_2 = _a.sent();
                    return [4 /*yield*/, context.app.alert("Invalid JSON!", "Error: " + e_2.message)];
                case 4:
                    _a.sent();
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
var provider;
function loadProvider(context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!!provider) return [3 /*break*/, 2];
                    _a = gitlab_js_1.GitlabService.bind;
                    _b = [void 0, context];
                    return [4 /*yield*/, loadConfig(context)];
                case 1:
                    provider = new (_a.apply(gitlab_js_1.GitlabService, _b.concat([_c.sent()])))();
                    _c.label = 2;
                case 2: return [2 /*return*/, provider];
            }
        });
    });
}
module.exports.workspaceActions = [
    {
        label: 'GitLab - Settings',
        icon: 'fa-cogs',
        action: function (context, models) { return __awaiter(void 0, void 0, void 0, function () {
            var currentConfig, config, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        return [4 /*yield*/, fetchOrSetConfig(context)];
                    case 1:
                        currentConfig = _a.sent();
                        return [4 /*yield*/, context.app.prompt('GitLab - Settings', {
                                label: 'JSON string',
                                defaultValue: JSON.stringify(currentConfig),
                                submitName: 'Save',
                                cancelable: true,
                            })];
                    case 2:
                        config = _a.sent();
                        return [4 /*yield*/, context.store.setItem(gitlabSyncConfigKey, config)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_3 = _a.sent();
                        return [4 /*yield*/, context.app.alert(e_3.message)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); },
    },
    {
        label: 'GitLab - Check for updates',
        icon: 'fa-cogs',
        action: function (context, models) { return __awaiter(void 0, void 0, void 0, function () {
            var previousLastCommitFetched, provider, repoLastCommit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.store.getItem(gitlabSyncLastCommitKey)];
                    case 1:
                        previousLastCommitFetched = _a.sent();
                        return [4 /*yield*/, loadProvider(context)];
                    case 2:
                        provider = _a.sent();
                        return [4 /*yield*/, provider.getLastCommit()];
                    case 3:
                        repoLastCommit = _a.sent();
                        if (!(repoLastCommit === previousLastCommitFetched)) return [3 /*break*/, 5];
                        return [4 /*yield*/, context.app.alert('Collections are up to date', 'The repo has not been updated since the last pull')];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, context.app.alert('Collections are outdated', 'The repo has been updated')];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); },
    },
    {
        label: 'GitLab - Pull Collections',
        icon: 'fa-download',
        action: function (context, models) { return __awaiter(void 0, void 0, void 0, function () {
            var provider_1, _a, _b, file, e_4_1, _c, _d, _e, e_5;
            var e_4, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 14, , 16]);
                        return [4 /*yield*/, loadProvider(context)];
                    case 1:
                        provider_1 = _g.sent();
                        _g.label = 2;
                    case 2:
                        _g.trys.push([2, 8, 9, 10]);
                        return [4 /*yield*/, provider_1.get()];
                    case 3:
                        _a = __values.apply(void 0, [_g.sent()]), _b = _a.next();
                        _g.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        file = _b.value;
                        return [4 /*yield*/, context.data.import.raw(JSON.stringify(file))];
                    case 5:
                        _g.sent();
                        _g.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_4_1 = _g.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _d = (_c = context.store).setItem;
                        _e = [gitlabSyncLastCommitKey];
                        return [4 /*yield*/, provider_1.getLastCommit()];
                    case 11: return [4 /*yield*/, _d.apply(_c, _e.concat([_g.sent()]))];
                    case 12:
                        _g.sent();
                        return [4 /*yield*/, context.app.alert('GitLab - Pull Collection', 'Process concluded')];
                    case 13:
                        _g.sent();
                        return [3 /*break*/, 16];
                    case 14:
                        e_5 = _g.sent();
                        return [4 /*yield*/, context.app.alert('Collection query error for the project', e_5.message)];
                    case 15:
                        _g.sent();
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        }); },
    },
    {
        label: 'GitLab - Push Collections',
        icon: 'fa-upload',
        action: function (context, models) { return __awaiter(void 0, void 0, void 0, function () {
            var data, content, provider_2, mergeRequestURL, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4 /*yield*/, context.data.export.insomnia({ includePrivate: false, format: 'json' })];
                    case 1:
                        data = _a.sent();
                        content = JSON.stringify(JSON.parse(data), null, 2);
                        return [4 /*yield*/, loadProvider(context)];
                    case 2:
                        provider_2 = _a.sent();
                        return [4 /*yield*/, provider_2.update(content)];
                    case 3:
                        mergeRequestURL = _a.sent();
                        return [4 /*yield*/, context.app.alert('GitLab - Push Collection', "See your PR: " + mergeRequestURL)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        e_6 = _a.sent();
                        return [4 /*yield*/, context.app.alert('Collection update error for the project', e_6.message)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); },
    }
];
