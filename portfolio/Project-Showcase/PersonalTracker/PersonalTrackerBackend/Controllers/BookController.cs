using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace PersonalTrackerBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public BookController(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    [HttpPost("search-books")]
    public async Task<ActionResult<BookSearchResponse>> SearchBooks([FromBody] BookSearchRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Query))
                return BadRequest("Query is required");

            var apiKey = _configuration["GoogleBooks:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                // Return mock data if no API key is configured
                return Ok(new BookSearchResponse
                {
                    Books = GetMockBooks(request.Query)
                });
            }

            var url = $"https://www.googleapis.com/books/v1/volumes?q={Uri.EscapeDataString(request.Query)}&maxResults=10&key={apiKey}";
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                // Fallback to mock data if API call fails
                return Ok(new BookSearchResponse
                {
                    Books = GetMockBooks(request.Query)
                });
            }

            var content = await response.Content.ReadAsStringAsync();
            var googleResponse = JsonSerializer.Deserialize<GoogleBooksResponse>(content);

            var books = googleResponse?.Items?.Select(item => new Book
            {
                Id = item.Id,
                Title = item.VolumeInfo?.Title ?? "Unknown Title",
                Author = item.VolumeInfo?.Authors?.FirstOrDefault() ?? "Unknown Author",
                Pages = item.VolumeInfo?.PageCount,
                CoverUrl = item.VolumeInfo?.ImageLinks?.Thumbnail,
                Description = item.VolumeInfo?.Description
            }).ToList() ?? new List<Book>();

            return Ok(new BookSearchResponse { Books = books });
        }
        catch (Exception ex)
        {
            // Return mock data on any error
            return Ok(new BookSearchResponse
            {
                Books = GetMockBooks(request.Query)
            });
        }
    }

    private List<Book> GetMockBooks(string query)
    {
        var mockBooks = new List<Book>
        {
            new Book
            {
                Id = "1",
                Title = "The Psychology of Money",
                Author = "Morgan Housel",
                Pages = 256,
                CoverUrl = null,
                Description = "Timeless lessons on wealth, greed, and happiness"
            },
            new Book
            {
                Id = "2",
                Title = "The Almanack of Naval Ravikant",
                Author = "Eric Jorgenson",
                Pages = 288,
                CoverUrl = null,
                Description = "A guide to wealth and happiness"
            },
            new Book
            {
                Id = "3",
                Title = "Atomic Habits",
                Author = "James Clear",
                Pages = 320,
                CoverUrl = null,
                Description = "Tiny changes, remarkable results"
            },
            new Book
            {
                Id = "4",
                Title = "Deep Work",
                Author = "Cal Newport",
                Pages = 304,
                CoverUrl = null,
                Description = "Rules for focused success in a distracted world"
            },
            new Book
            {
                Id = "5",
                Title = "The 7 Habits of Highly Effective People",
                Author = "Stephen Covey",
                Pages = 432,
                CoverUrl = null,
                Description = "Powerful lessons in personal change"
            },
            new Book
            {
                Id = "6",
                Title = "Thinking, Fast and Slow",
                Author = "Daniel Kahneman",
                Pages = 499,
                CoverUrl = null,
                Description = "The psychology of decision making"
            }
        };

        // Filter books based on query
        return mockBooks.Where(book => 
            book.Title.ToLower().Contains(query.ToLower()) ||
            book.Author.ToLower().Contains(query.ToLower())
        ).ToList();
    }
}

// Request and Response Models
public class BookSearchRequest
{
    public string Query { get; set; } = string.Empty;
}

public class BookSearchResponse
{
    public List<Book> Books { get; set; } = new();
}

public class Book
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int? Pages { get; set; }
    public string? CoverUrl { get; set; }
    public string? Description { get; set; }
}

// Google Books API Response Models
public class GoogleBooksResponse
{
    public List<GoogleBookItem>? Items { get; set; }
}

public class GoogleBookItem
{
    public string Id { get; set; } = string.Empty;
    public GoogleVolumeInfo? VolumeInfo { get; set; }
}

public class GoogleVolumeInfo
{
    public string? Title { get; set; }
    public List<string>? Authors { get; set; }
    public int? PageCount { get; set; }
    public string? Description { get; set; }
    public GoogleImageLinks? ImageLinks { get; set; }
}

public class GoogleImageLinks
{
    public string? Thumbnail { get; set; }
} 