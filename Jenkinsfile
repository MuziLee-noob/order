pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]], 
                                                                                                                                                                                                                                                                                                                                    userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }

    stage('构建') {
      steps {
        echo '构建中...'
        sh 'npm config set proxy http://squid:squid@10.15.7.6:3128'
        sh 'npm config set registry https://registry.npm.taobao.org'
        sh 'npm install'
        sh 'npm run build'
        echo '构建完成.'
      }
    }

    stage('打包镜像') {
      steps {
        sh "docker build -t ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} ."
        sh "docker tag ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} ${ARTIFACT_IMAGE}:latest"
      }
    }

    stage('推送到制品库') {
      steps {
        script {
          docker.withRegistry("https://${ARTIFACT_BASE}", "${env.DOCKER_REGISTRY_CREDENTIALS_ID}") {
            docker.image("${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF}").push()
            docker.image("${ARTIFACT_IMAGE}:latest").push()
          }
        }

      }
    }

  }
  environment {
    ENTERPRISE = 'cmict'
    PROJECT = 'onefusion'
    ARTIFACT = 'onefusion'
    CODE_DEPOT = 'onefusion-web-equipment'
    ARTIFACT_BASE = 'cmict-docker.pkg.coding.dev.ict.cmcc'
    ARTIFACT_IMAGE = "${ARTIFACT_BASE}/${PROJECT}/${ARTIFACT}/${CODE_DEPOT}"
  }
}