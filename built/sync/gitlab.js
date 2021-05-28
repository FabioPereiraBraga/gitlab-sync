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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitlabService = void 0;
var axios_1 = __importDefault(require("axios"));
var GitlabService = /** @class */ (function () {
    function GitlabService(context, config) {
        this.context = context;
        this.context = context;
        this.config = config;
        this.baseGitlabUrl = this.config.api_url + "/api/v4/projects/" + this.config.id_project;
        GitlabService.validateConfig(config);
    }
    GitlabService.prototype.authenticate = function () {
        return axios_1.default.create({
            baseURL: "" + this.config.api_url,
            timeout: this.config.timeout,
            headers: { Authorization: "Bearer " + this.config.token },
        });
    };
    GitlabService.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listOfFiles, _a, promises, responses, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!(this.config.files.length === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getJsonFiles()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = this.config.files;
                        _b.label = 3;
                    case 3:
                        listOfFiles = _a;
                        promises = listOfFiles
                            .map(function (file) { return _this.authenticate()
                            .get(_this.baseGitlabUrl + "/repository/files/" + file + "/raw?ref=" + _this.config.branch); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 4:
                        responses = _b.sent();
                        return [2 /*return*/, responses.map(function (response) { return response.data; })];
                    case 5:
                        e_1 = _b.sent();
                        throw "Collection query failed for informed project " + this.config.id_project;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GitlabService.prototype.ls = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.authenticate().get(this.baseGitlabUrl + "/repository/tree?ref=" + this.config.branch)];
            });
        });
    };
    GitlabService.prototype.getJsonFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret, allFiles, re;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ls()];
                    case 1:
                        ret = _a.sent();
                        allFiles = ret.data;
                        re = /.*\.json$/;
                        return [2 /*return*/, allFiles
                                .map(function (x) { return x.name; })
                                .filter(function (name) { return name.match(re); })];
                }
            });
        });
    };
    GitlabService.prototype.getUserName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticate().get(this.config.api_url + "/api/v4/user")];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret.data.username];
                }
            });
        });
    };
    GitlabService.prototype.createBranch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var branchName, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserName()];
                    case 1:
                        branchName = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, this.authenticate().post(this.baseGitlabUrl + "/repository/branches", { "branch": branchName, "ref": this.config.branch })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_2 = _a.sent();
                        return [4 /*yield*/, this.context.app.alert('ERROR on branch creation', "Check if you have permission and the branch doesn't already exists.\n " + e_2.message)];
                    case 5:
                        _a.sent();
                        throw e_2;
                    case 6: return [2 /*return*/, branchName];
                }
            });
        });
    };
    GitlabService.prototype.commit = function (content, branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.authenticate().post(this.baseGitlabUrl + "/repository/commits", {
                                "branch": branchName,
                                "commit_message": "More requests!",
                                "actions": [{
                                        "action": "update",
                                        "file_path": "workspace.json",
                                        "content": content
                                    }]
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_3 = _a.sent();
                        return [4 /*yield*/, this.context.app.alert('ERROR on commit to branch', e_3.message)];
                    case 3:
                        _a.sent();
                        throw e_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GitlabService.prototype.createMergeRequest = function (branchName) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.authenticate().post(this.baseGitlabUrl + "/merge_requests", {
                                "source_branch": branchName,
                                "target_branch": this.config.branch,
                                "title": "New requests from " + branchName,
                                "remove_source_branch": true
                            })];
                    case 1:
                        ret = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_4 = _a.sent();
                        return [4 /*yield*/, this.context.app.alert('ERROR creating Merge Request', e_4.message)];
                    case 3:
                        _a.sent();
                        throw e_4;
                    case 4: return [2 /*return*/, ret.data.web_url];
                }
            });
        });
    };
    GitlabService.prototype.update = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var branchName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createBranch()];
                    case 1:
                        branchName = _a.sent();
                        return [4 /*yield*/, this.commit(content, branchName)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.createMergeRequest(branchName)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GitlabService.prototype.getLastCommit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticate()
                            .get(this.baseGitlabUrl + "/repository/commits?ref_name=" + this.config.branch)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret.data[0].id];
                }
            });
        });
    };
    GitlabService.validateConfig = function (config) {
        if (config.api_url.length === 0) {
            throw 'Invalid api_url';
        }
        if (config.id_project === 0) {
            throw 'Invalid id_project';
        }
        if (config.branch.length === 0) {
            throw 'Invalid branch';
        }
        if (config.token.length === 0) {
            throw 'Invalid token';
        }
    };
    return GitlabService;
}());
exports.GitlabService = GitlabService;
