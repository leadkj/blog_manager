pipeline {
    agent any
    environment{
        PACKAGE_NAME = ""
    }
    stages {
        stage('def variables...') {
            steps {
                script {
                    PACKAGE_NAME = sh(script: "date +%Y%m%d%H%M%S_${BUILD_NUMBER}.tgz", returnStdout: true)
                    //定义的变量无法在多行shell中使用
                    echo "${PACKAGE_NAME}"
                }
            }
        }
        stage('pull code.....') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/${branch}']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '9da17123-3b12-4c17-8542-3b4ab650b6af', url: 'https://github.com/leadkj/blog_front.git']]])
            }
        }
        stage('build code.....') {
            steps {
                sh "sed -i 's/127.0.0.1/api.weijx.top/' src/main.js"
                sh "cnpm install;cnpm run build"
            }
        }
        stage('package code.....') {
            steps {
                sh '''
                tar zcf /tmp/${JOB_NAME}_${BUILD_NUMBER}.tgz dist
                '''
            }
        }
        stage('deploy package.....') {
            steps {
                sh "ansible aliyun -m copy -a 'src=/tmp/${JOB_NAME}_${BUILD_NUMBER}.tgz dest=/opt/backup/blog_manager'"
                sh "ansible aliyun -m shell -a 'cd /opt/backup/blog_manager;tar -zxf ${JOB_NAME}_${BUILD_NUMBER}.tgz;sh /opt/deploy_cmd/blog_front.sh'"

            }
        }
        stage('delete package.....') {
            steps {
                sh "rm -f /tmp/${JOB_NAME}_${BUILD_NUMBER}.tgz"
            }
        }
    }
}