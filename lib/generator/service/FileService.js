const fs = require('fs')
const S = require('string')

class FileService {

    constructor(opts) {
        this.opts = opts || {}
    }

    async initFrameworkOutput(projectName, libDir) {
        let outputPath = process.cwd() + '/output/';
        await this.mkdir(outputPath)
        let projectPath = outputPath + projectName;
        await this.mkdir(projectPath)

        let corePath = process.cwd() + '/lib/' + libDir + '/';
        await this.copyDir(corePath, projectPath);
    }

    async initTablesOutput() {
        let outputPath = process.cwd() + '/output/';
        await this.mkdir(outputPath)
        let projectPath = outputPath + 'tables';
        await this.mkdir(projectPath)
    }

    async write(artTemplateHtml, path, fileName) {
        await this.mkdir(path)

        let filePath = path + '/' + fileName
        await fs.writeFileSync(filePath, artTemplateHtml);
    }

    async mkdir(dirPath) {
        let isExists = await fs.existsSync(dirPath);
        if (isExists == false) {
            //创建文件夹
            await fs.mkdirSync(dirPath)
        }
    }

    async copyDir(src, dist) {

        await this.mkdir(dist)

        await this._copy(src, dist)
    }

    async copyFile (src, dist) {
        let file = await fs.readFileSync(src);
        await fs.writeFileSync(dist, file)
    }

    async _copy(src, dist) {
        let paths = await fs.readdirSync(src);
        for (let i=0; i<paths.length; i++) {
            let path = paths[i];
            if (S(path).startsWith('.')) {
                continue
            }

            let _src = src + '/' + path;
            let _dist = dist + '/' + path;

            let stat = await fs.statSync(_src);
            if (stat.isFile()){
                // let file = await fs.readFileSync(_src);
                // await fs.writeFileSync(_dist, file)
                await this.copyFile(_src, _dist)
            } else if (stat.isDirectory()) {
                await this.copyDir(_src, _dist)
            }
        }
    }

}

let fileService = new FileService();

module.exports = fileService