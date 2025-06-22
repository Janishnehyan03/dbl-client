import { debounce } from "lodash";
import {
  ArrowRight,
  BookOpen,
  BookText,
  CheckCircle,
  Scan,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Axios from "../../utils/Axios";

interface Book {
  _id: string;
  title: string;
  isbn: string;
  status: "issued" | "available";
  dueDate?: string;
  author?: string;
  coverImage?: string;
}

interface Member {
  _id: string;
  name: string;
  admissionNumber: string;
  issuedBooks: Book[];
  section?: { name: string };
  class?: { name: string };
  division?: { name: string };
  department?: { name: string };
}

interface IssueBookRequest {
  bookId: string;
  patronId: string;
}

function IssueBookPage() {
  const [memberCode, setMemberCode] = useState("");
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [bookCode, setBookCode] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(false);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchMember = useCallback(
    debounce(async (code: string) => {
      if (!code.trim()) {
        setFoundMember(null);
        setSelectedBook(null);
        setBookCode("");
        return;
      }

      setIsLoadingMember(true);
      try {
        const response = await Axios.get(
          `/patrons/admission-number/${code.trim()}`
        );
        const patron = response.data._doc;

        if (!patron) {
          throw new Error("Member not found");
        }

        const member: Member = {
          _id: patron._id,
          name: patron.name,
          admissionNumber: patron.admissionNumber,
          issuedBooks: response.data.circulations.map((circ: any) => ({
            _id: circ.book._id,
            title: circ.book.title,
            isbn: circ.book.isbn,
            status: "issued",
            dueDate: circ.dueDate,
            author: circ.book.author,
            coverImage: circ.book.coverImage,
          })),
          section: patron.section ? { name: patron.section.name } : undefined,
          class: patron.class ? { name: patron.class.name } : undefined,
          division: patron.division
            ? { name: patron.division.name }
            : undefined,
          department: patron.department
            ? { name: patron.department.name }
            : undefined,
        };

        setFoundMember(member);
        setToast({ message: `Member ${member.name} found`, type: "success" });
      } catch (error) {
        setFoundMember(null);
        setSelectedBook(null);
        setBookCode("");
        setToast({ message: "Member not found", type: "error" });
      } finally {
        setIsLoadingMember(false);
      }
    }, 300),
    []
  );

  const fetchBook = useCallback(
    debounce(async (code: string) => {
      if (!code.trim() || !foundMember) {
        setSelectedBook(null);
        return;
      }

      setIsLoadingBook(true);
      try {
        const response = await Axios.get(
          `/books/search/data?search=${encodeURIComponent(code.trim())}`
        );
        const fetchedBooks: Book[] = response.data;

        if (fetchedBooks.length > 0 && fetchedBooks[0].status === "available") {
          setSelectedBook(fetchedBooks[0]);
          setToast({
            message: `Book "${fetchedBooks[0].title}" found`,
            type: "success",
          });
        } else {
          setSelectedBook(null);
          setToast({ message: "Book not found or unavailable", type: "error" });
        }
      } catch (error) {
        setSelectedBook(null);
        setToast({ message: "Book not found", type: "error" });
      } finally {
        setIsLoadingBook(false);
      }
    }, 300),
    [foundMember]
  );

  useEffect(() => {
    fetchMember(memberCode);
  }, [memberCode, fetchMember]);

  useEffect(() => {
    if (foundMember) {
      fetchBook(bookCode);
    }
  }, [bookCode, foundMember, fetchBook]);

  const handleIssue = async () => {
    if (!foundMember || !selectedBook) {
      setToast({ message: "Select a member and book", type: "error" });
      return;
    }

    setIsProcessing(true);
    try {
      const requestBody: IssueBookRequest = {
        bookId: selectedBook._id,
        patronId: foundMember._id,
      };

      const response = await Axios.post("/circulations/issue", requestBody);

      setFoundMember((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          issuedBooks: [
            ...prev.issuedBooks,
            {
              ...selectedBook,
              status: "issued",
              dueDate: response.data.dueDate,
            },
          ],
        };
      });

      setToast({
        message: `"${selectedBook.title}" issued to ${foundMember.name}`,
        type: "success",
      });

      setSelectedBook(null);
      setBookCode("");
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to issue book",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturn = async (book: Book) => {
    if (!foundMember) return;

    setIsProcessing(true);
    try {
      await Axios.post("/circulations/return", {
        bookId: book._id,
        patronId: foundMember._id,
      });

      setFoundMember((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          issuedBooks: prev.issuedBooks.filter((b) => b._id !== book._id),
        };
      });

      setToast({
        message: `"${book.title}" returned successfully`,
        type: "success",
      });
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to return book",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const IssueButton = () => (
    <button
      className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200 ${
        !foundMember || !selectedBook || isProcessing
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
      onClick={handleIssue}
      disabled={!foundMember || !selectedBook || isProcessing}
    >
      <ArrowRight size={16} />
      {isProcessing ? "Processing..." : `Issue to ${foundMember?.name}`}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Library Book Management
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Scan or enter member ID and book ISBN to issue or return books
          </p>
        </header>

        {toast && (
          <div
            className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg z-50 text-sm ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <XCircle size={16} className="text-red-600" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <XCircle size={14} />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-indigo-600 p-3 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User size={18} />
                Member Details
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Scan or enter Member ID"
                  className="border border-gray-300 rounded-lg pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-50"
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  disabled={isLoadingMember}
                />
                {isLoadingMember && (
                  <p className="text-xs text-gray-500 mt-1">
                    Searching member...
                  </p>
                )}
              </div>

              {foundMember ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-100 text-indigo-800 rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
                      {foundMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">
                        {foundMember.name}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        ID: {foundMember.admissionNumber}
                      </p>
                      {foundMember.class ? (
                        <>
                          <p className="text-gray-600 text-sm">
                            Section: {foundMember.section?.name || "N/A"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Class: {foundMember.class?.name || "N/A"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Division: {foundMember.division?.name || "N/A"}
                          </p>
                        </>
                      ) : (
                        foundMember.department && (
                          <p className="text-gray-600 text-sm">
                            Department: {foundMember.department.name || "N/A"}
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 text-sm mb-2 flex items-center gap-2">
                      <BookOpen size={14} />
                      Issued Books
                    </h5>
                    {foundMember.issuedBooks.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-3 text-center text-gray-500 text-sm">
                        No books issued
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {foundMember.issuedBooks.map((book) => (
                          <li
                            key={book._id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              {book.coverImage ? (
                                <img
                                  src={book.coverImage}
                                  alt={book.title}
                                  className="w-10 h-14 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center">
                                  <BookText size={14} />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm">
                                  {book.title}
                                </p>
                                {book.author && (
                                  <p className="text-xs text-gray-600">
                                    {book.author}
                                  </p>
                                )}
                                <p className="text-xs text-red-600 mt-1">
                                  Due: {book.dueDate || "N/A"}
                                </p>
                              </div>
                            </div>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium disabled:opacity-50"
                              onClick={() => handleReturn(book)}
                              disabled={isProcessing}
                            >
                              Return
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <User className="text-gray-400" size={14} />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Enter a member ID to view details
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="bg-indigo-600 p-3 text-white rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen size={18} />
                Book Issue
              </h3>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {foundMember ? (
                <>
                  <div className="relative">
                    <Scan
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Enter ISBN to issue"
                      className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      value={bookCode}
                      onChange={(e) => setBookCode(e.target.value)}
                      disabled={isLoadingBook || isProcessing}
                    />
                    {isLoadingBook && (
                      <p className="text-sm text-gray-500 mt-1">
                        Searching book...
                      </p>
                    )}
                  </div>

                  {selectedBook && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        {selectedBook.coverImage ? (
                          <img
                            src={selectedBook.coverImage}
                            alt={selectedBook.title}
                            className="w-14 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-14 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>
                        )}
                        <div className="flex-grow">
                          <p className="font-bold text-sm">
                            {selectedBook.title}
                          </p>
                          {selectedBook.author && (
                            <p className="text-gray-600 text-sm">
                              {selectedBook.author}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            ISBN: {selectedBook.isbn}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium mt-2 inline-block ${
                              selectedBook.status === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {selectedBook.status === "available"
                              ? "Available"
                              : "Issued"}
                          </span>
                        </div>
                      </div>

                      {selectedBook.status === "available" ? (
                        <div className="mt-4">
                          <IssueButton />
                        </div>
                      ) : (
                        <p className="text-xs text-red-500 mt-3 text-center">
                          Book is currently issued
                        </p>
                      )}
                    </div>
                  )}

                  {!selectedBook && bookCode && !isLoadingBook && (
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <BookOpen className="text-gray-400" size={14} />
                      </div>
                      <p className="text-gray-500 text-sm">No book found</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <BookOpen className="text-gray-400" size={14} />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Select a member first to issue a book
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueBookPage;
