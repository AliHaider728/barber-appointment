import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Search, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import axios from 'axios';

const AllBranchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data/branches.json');
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load branches. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#faf7f2] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-12 border-b border-border">
        <h1 className="text-4xl font-bold text-foreground mb-4">Our Branches</h1>
        <p className="text-lg text-muted-foreground">Find your nearest barber shop and book an appointment</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" aria-label="Search" />
          <Input
            placeholder="Search by city, name, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading branches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No branches found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBranches.map((branch) => (
              <Card key={branch._id} className="p-6 hover:shadow-lg transition">
                <h3 className="text-2xl font-semibold text-foreground mb-6">{branch.name}</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Location" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{branch.address}</p>
                      <p className="text-sm text-muted-foreground">{branch.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" aria-label="Opening Hours" />
                    <p className="text-sm text-foreground">{branch.openingHours}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-label="Phone" />
                    <p className="text-sm text-foreground">{branch.phone}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/branches/${branch._id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  <Link to={`/booking?branch=${branch._id}`} className="flex-1">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Book Now <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllBranchesPage;