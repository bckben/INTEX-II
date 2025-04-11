using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace CineNiche.Data
{
    public class NoOpEmailSender<TUser> : IEmailSender<TUser> where TUser : class
    {
        public Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink)
        {
            Console.WriteLine($"[NoOpEmailSender] Confirmation to {email}: {confirmationLink}");
            return Task.CompletedTask;
        }

        public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink)
        {
            Console.WriteLine($"[NoOpEmailSender] Password reset to {email}: {resetLink}");
            return Task.CompletedTask;
        }

        public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode)
        {
            Console.WriteLine($"[NoOpEmailSender] Password reset code to {email}: {resetCode}");
            return Task.CompletedTask;
        }

        public Task SendEmailAsync(TUser user, string email, string subject, string htmlMessage)
        {
            Console.WriteLine($"[NoOpEmailSender] Email to {email} | Subject: {subject} | Message: {htmlMessage}");
            return Task.CompletedTask;
        }
    }
}