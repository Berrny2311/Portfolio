pipeline {
    agent any

    environment {
        SSH_TARGET = "bernhardantl@192.168.178.60"
        TARGET_DIR = "/var/www/BernhardsWeb"
    }

    triggers {
        genericTrigger(
            genericVariables: [
                [key: 'TAG_NAME', value: '$.ref']
            ],
            causeString: 'Triggered by Tag: $TAG_NAME',
            token: 'mein-geheimes-projekt-token',
            printPostContent: true,
            // Filter: Nur auslösen, wenn "refs/tags/" im Namen vorkommt
            regexpFilterText: '$TAG_NAME',
            regexpFilterExpression: '^refs/tags/.*'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                // Holt den Code des aktuellen Tags
                checkout scm
            }
        }

        stage('Replace Variables') {
            steps {
                script {
                    // Extrahiert "v1.0.0" aus "refs/tags/v1.0.0"
                    def cleanVersion = TAG_NAME.replace('refs/tags/', '')
                    def buildDate = new Date().format('dd.MM.yyyy HH:mm')

                    // Platzhalter im HTML ersetzen (z.B. index.html)
                    sh "sed -i 's/{{VERSION}}/${cleanVersion}/g' index.html"
                    sh "sed -i 's/{{BUILD_DATE}}/${buildDate}/g' index.html"
                    
                    echo "Version ${cleanVersion} in HTML geschrieben."
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sshAgent(['nginx-server-ssh']) {
                    // Kopiert die Dateien per SCP auf den Linux Server
                    sh "scp -o StrictHostKeyChecking=no index.html ${SSH_TARGET}:${TARGET_DIR}"
                }
            }
        }
    }
}
