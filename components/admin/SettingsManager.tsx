import AccountSetting from './settings/AccountSetting'
import PasswordHandler from './settings/PasswordHandler'
import DangerZone from './settings/DangerZone'


export default function SettingsManager() {
  return (
    <div className="space-y-8">
      <AccountSetting />
      <PasswordHandler />
      <DangerZone />
    </div>
  )
} 