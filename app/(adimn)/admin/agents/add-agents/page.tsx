import AddAgentForm from '@/components/admin/agents/AddAgentForm'
import AgentCredentialsSection from '@/components/admin/agents/AgentCredentialsSection'

const AddAgentPage = () => {
  return (
    <div className="space-y-8">
      <AgentCredentialsSection />
      <AddAgentForm />
    </div>
  )
}

export default AddAgentPage