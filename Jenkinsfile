pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
        GITHUB_CREDENTIALS = credentials('github-credentials-id')
        SSH_CREDENTIALS = credentials('ssh-credentials-id')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials-id', url: 'https://github.com/Brij54/Video_chat.git'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t brij8511/node-js:0.0.0 .'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t alpine/latest .'
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker run --rm brij8511/node-js:0.0.0 npm test'
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker run --rm alpine/latest npm test'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push brij8511/node-js:0.0.0'
                    sh 'docker push alpine/latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    ansiblePlaybook(
                        playbook: 'ansible/deploy.yml',
                        inventory: 'ansible/inventory',
                        credentialsId: 'ssh-credentials-id'
                    )
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
