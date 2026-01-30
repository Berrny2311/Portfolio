pipeline {
    agent any

    environment {
        SSH_TARGET = "bernhardantl@192.168.178.60"
        TARGET_DIR = "/var/www/BernhardsWeb"
    }

    triggers {
        GenericTrigger(
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
                    def buildYear = new Date().format('yyyy')
                    
                     // Properties aus der Datei auf dem Server laden
                     def props = readProperties file: env.CONFIG_FILE
                     def mail = props['EMAIL']
                     def tel = props['TELNR']

       
                    // Platzhalter im HTML ersetzen (z.B. index.html)
                    sh "sed -i 's/{{VERSION}}/${cleanVersion}/g' index.html"
                    sh "sed -i 's/{{EMAIL}}/${mail}/g' index.html"
                    sh "sed -i 's/{{TELNR}}/${tel}/g' index.html"
                     sh "sed -i 's/{{YEAR}}/${buildYear}/g' index.html"

                    //sh "sed -i 's/{{BUILD_DATE}}/${buildDate}/g' index.html"
                    
                    echo "Version ${cleanVersion} in HTML geschrieben."
                }
            }
        }
        

        stage('Deploy to Nginx') {
            steps {
                sshagent(['nginx-server-ssh']) {
                    // rsync mit mehreren Excludes für Scripts und Git-Daten
                    sh """
                        rsync -avz -e 'ssh -o StrictHostKeyChecking=no' \
                        --exclude='.git*' \
                        --exclude='*.cmd' \
                        --exclude='*.ps1' \
                        --exclude='*.sh' \
                        --exclude='Jenkinsfile' \
                        . ${SSH_TARGET}:${TARGET_DIR}
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment erfolgreich abgeschlossen!'
        }
        failure {
            echo 'Deployment fehlgeschlagen!'
        }
    }
}