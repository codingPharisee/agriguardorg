
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, FileText, Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Document {
  id: string;
  title: string;
  content: string;
  source?: string;
  document_type?: string;
  category?: string;
  created_at: string;
}

interface DocumentManagerProps {
  adminRole: string | null;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ adminRole }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state for document upload
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    source: "",
    document_type: "research_paper",
    category: ""
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate embedding for the document content
      const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embedding', {
        body: { text: formData.content }
      });

      if (embeddingError) {
        console.error('Embedding error:', embeddingError);
        // Continue without embedding for now
      }

      const { error } = await supabase
        .from('documents')
        .insert([{
          ...formData,
          embedding: embeddingData?.embedding || null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setIsUploadDialogOpen(false);
      setFormData({
        title: "",
        content: "",
        source: "",
        document_type: "research_paper",
        category: ""
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || doc.document_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Management
            </CardTitle>
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Document title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Document content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                  />
                  <Input
                    placeholder="Source (optional)"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select 
                      value={formData.document_type} 
                      onValueChange={(value) => setFormData({...formData, document_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="research_paper">Research Paper</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                        <SelectItem value="guideline">Guideline</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="extension_material">Extension Material</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleUploadDocument} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="research_paper">Research Paper</SelectItem>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="guideline">Guideline</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="extension_material">Extension Material</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading documents...</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No documents found</div>
            ) : (
              filteredDocuments.map((doc) => (
                <Card key={doc.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {doc.content.substring(0, 200)}...
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{doc.document_type}</Badge>
                          {doc.category && <Badge variant="outline">{doc.category}</Badge>}
                        </div>
                        {doc.source && (
                          <p className="text-xs text-gray-500">Source: {doc.source}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Added: {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
