import { AuthConfig } from "src/auth/auth.config"
import { UsersConfig } from "../users/users.config"
import { SecretsConfig } from "../secrets/secrets.config"
import { ReportsConfig } from "src/reports/reports.config"
import { SettingsConfig } from "../settings/settings.config"

type Configuration = {
  auth: AuthConfig,
  users: UsersConfig,
  secrets: SecretsConfig,
  reports: ReportsConfig,
  settings: SettingsConfig
}

export default (): Configuration => ({
  auth: {
    secretName: process.env.AWS_AUTH_JWT_SECRET_NAME,
  },
  users: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT,
  },
  secrets: {
    region: process.env.AWS_REGION,
    secretId: process.env.AWS_SECRET_ID,
    secretNames: [ process.env.AWS_AUTH_JWT_SECRET_NAME ],
    devSecretValue: process.env.AWS_DEV_SECRET_VALUE
  },
  reports: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT
  },
  settings: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_DYNAMODB_ENDPOINT
  }
})