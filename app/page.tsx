import FeatureCards from "@/components/landing/FeatureCards";
import FooterPlaceholder from "@/components/landing/FooterPlaceholder";
import HeroSection from "@/components/landing/hero/HeroSection";
import NavigationBar from "@/components/landing/NavigationBar";
import TrustedCompanies from "@/components/landing/TrustedCompanies";
import ProductShowcase from "@/components/landing/ProductShowcase/ProductShowcase";
import FeatureCarousel from "@/components/landing/FeatureCarousel/FeatureCarousel";
import KnowledgeGraphSection from "@/components/landing/knowledge-graph/KnowledgeGraphSection";
import DocumentProcessingSection from "@/components/landing/document-processing/DocumentProcessingSection";
import GraphRagSearchSection from "@/components/landing/graphrag-search/GraphRagSearchSection";
import ComplianceIntelligenceSection from "@/components/landing/compliance-intelligence/ComplianceIntelligenceSection";
import ExpertKnowledgeSection from "@/components/landing/expert-knowledge/ExpertKnowledgeSection";
import DecisionBriefsSection from "@/components/landing/decision-briefs/DecisionBriefsSection";
import PlatformIntelligenceSection from "@/components/landing/platform-intelligence/PlatformIntelligenceSection";
import FinalCtaSection from "@/components/landing/cta/FinalCtaSection";

export default function HomePage() {
  return (
    <main>
      <NavigationBar />
      
      {/* 1. Hero */}
      <HeroSection />
      
      {/* 2. Trusted Companies */}
      <TrustedCompanies />
      
      {/* 3. See IndustroMind in Action */}
      <ProductShowcase />
      
      {/* 4. Intelligence at Every Layer (4 capability cards) */}
      <FeatureCards />
      
      {/* 5. Platform Capabilities (8 feature cards carousel) */}
      <FeatureCarousel />
      
      {/* 6. Knowledge Graph */}
      <KnowledgeGraphSection />
      
      {/* 7. Intelligent Document Processing */}
      <DocumentProcessingSection />
      
      {/* 8. GraphRAG Search */}
      <GraphRagSearchSection />
      
      {/* 9. Compliance Intelligence */}
      <ComplianceIntelligenceSection />
      
      {/* 10. Expert Knowledge Capture */}
      <ExpertKnowledgeSection />
      
      {/* 11. AI Decision Briefs */}
      <DecisionBriefsSection />
      
      {/* 12. One Connected Operational View */}
      <PlatformIntelligenceSection />
      
      {/* 13. Final CTA */}
      <FinalCtaSection />
      
      {/* 14. Footer */}
      <FooterPlaceholder />
    </main>
  );
}
