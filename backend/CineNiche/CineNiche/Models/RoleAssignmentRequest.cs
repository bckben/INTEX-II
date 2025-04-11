namespace CineNiche.Models
{
    public class RoleAssignmentRequest
    {
        public string UserEmail { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
    }
}