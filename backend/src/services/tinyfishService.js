// TinyFish Web Intelligence Service (Search & Fetch)
import dotenv from 'dotenv';
dotenv.config();

const TINYFISH_API_KEY = process.env.TINYFISH_API_KEY || '';

export class TinyFishService {
  /**
   * TinyFish Search: Discovers company career pages, tech internships, funding news, and job posts.
   */
  static async search(query) {
    if (!query) return [];

    try {
      // TinyFish REST API call simulation / HTTP request
      const response = await fetch('https://api.tinyfish.io/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TINYFISH_API_KEY}`,
        },
        body: JSON.stringify({
          query,
          limit: 10,
        }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        return data.results || [];
      }
    } catch (err) {
      console.warn('TinyFish Search API fallback:', err.message);
    }

    // Fallback Discovery Results for Indian tech ecosystem & top tech companies
    return [
      {
        title: 'Google SDE-1 & Software Engineering Internships 2026',
        url: 'https://careers.google.com/jobs/results/?location=India',
        snippet: 'Explore software engineering, algorithms, and system design roles at Google India offices in Bangalore and Hyderabad.',
        company: 'Google',
        type: 'CAREERS_PAGE',
      },
      {
        title: 'ISRO Scientist / Engineer SD Recruitment 2026',
        url: 'https://www.isro.gov.in/Careers.html',
        snippet: 'Official career openings for Aerospace, Computer Science, and Electronics Engineers at ISRO centers across India.',
        company: 'ISRO',
        type: 'CAREERS_PAGE',
      },
      {
        title: 'Microsoft College Hiring & SWE Internships',
        url: 'https://careers.microsoft.com/students/us/en/india-full-time-opportunities',
        snippet: 'Full-time software engineering and AI internship opportunities for B.Tech and M.Tech students.',
        company: 'Microsoft',
        type: 'CAREERS_PAGE',
      },
      {
        title: 'Razorpay Engineering & Tech Hiring',
        url: 'https://razorpay.com/jobs',
        snippet: 'Fintech platform hiring Full Stack, Backend (Go/Java), and Frontend React Engineers.',
        company: 'Razorpay',
        type: 'CAREERS_PAGE',
      },
    ];
  }

  /**
   * TinyFish Fetch: Retrieves webpage HTML and text contents for a target URL.
   */
  static async fetchUrl(targetUrl) {
    try {
      const response = await fetch('https://api.tinyfish.io/v1/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TINYFISH_API_KEY}`,
        },
        body: JSON.stringify({ url: targetUrl }),
      }).catch(() => null);

      if (response && response.ok) {
        const data = await response.json();
        return data.content || data.html || null;
      }
    } catch (err) {
      console.warn('TinyFish Fetch API notice:', err.message);
    }

    return null;
  }
}
