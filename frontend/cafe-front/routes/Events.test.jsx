import { screen, waitFor } from "@testing-library/react";
import { customRender } from "../test-utils";
import Events from "./Events";
import API from "../api/axios";
import "@testing-library/jest-dom";

// Mock the API
jest.mock("../api/axios");

describe("Events Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays a loading state initially", async () => {
    // Simulate an empty data response
    API.get.mockResolvedValueOnce({ data: [] });

    customRender(<Events />);

    // Check if it sees "Loading events..." on the page
    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();

    // Wait for fetch to complete
    await waitFor(() => expect(API.get).toHaveBeenCalledWith("/events"));
  });

  it("displays fetched events", async () => {
    // Mock data returned from the API
    const mockData = [
      {
        _id: "1",
        title: "Event 1",
        date: "2025-04-02T16:00:00",
        description: "Event 1 description",
        image: "image1.jpg",
      },
      {
        _id: "2",
        title: "Event 2",
        date: "2025-05-10T12:00:00",
        description: "Event 2 description",
        image: "image2.jpg",
      },
    ];

    // Resolve the GET request with mockData
    API.get.mockResolvedValueOnce({ data: mockData });

    customRender(<Events />);

    // Using findByText ensures the component has time to fetch & render
    const event1Title = await screen.findByText("Event 1");
    expect(event1Title).toBeInTheDocument();

    const event2Title = await screen.findByText("Event 2");
    expect(event2Title).toBeInTheDocument();
  });

  it("displays an error message on fetch failure", async () => {
    // Simulate an API error
    API.get.mockRejectedValueOnce(new Error("Network Error"));

    customRender(<Events />);

    const errorMessage = await screen.findByText(
      /Error loading events: Network Error/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
